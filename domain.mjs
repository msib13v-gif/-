export function normalizeDigits(value) {
  return String(value).replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

export function calculateEstimate({ area, floors, structure = 'concrete', quality = 'standard', city = 'تهران' }) {
  area = Number(normalizeDigits(area));
  floors = Number(normalizeDigits(floors));
  if (!Number.isFinite(area) || area < 20 || area > 100000) throw new Error('متراژ هر طبقه باید بین ۲۰ تا ۱۰۰٬۰۰۰ مترمربع باشد.');
  if (!Number.isInteger(floors) || floors < 1 || floors > 50) throw new Error('تعداد طبقات باید عددی بین ۱ تا ۵۰ باشد.');
  const qualityRates = { economy: 12500000, standard: 18500000, premium: 28500000 };
  const structureRates = { concrete: 1, steel: 1.12 };
  const cityRates = { 'تهران': 1, 'کرج': .94, 'اصفهان': .92, 'شیراز': .91, 'مشهد': .9, 'رشت': .96 };
  if (!(quality in qualityRates) || !(structure in structureRates) || !(city in cityRates)) throw new Error('گزینه‌های برآورد معتبر نیستند.');
  const rate = Math.round(qualityRates[quality] * structureRates[structure] * cityRates[city]);
  const total = Math.round(area * floors * rate);
  const parts = [ ['مصالح و تجهیزات', .52], ['دستمزد و اجرا', .3], ['طراحی و مجوزها', .08], ['ذخیره پیش‌بینی‌نشده', .1] ];
  let used = 0;
  const breakdown = parts.map(([label, share], i) => {
    const amount = i === parts.length - 1 ? total - used : Math.round(total * share);
    used += amount;
    return { label, share, amount };
  });
  return { area, floors, totalArea: area * floors, rate, total, breakdown };
}

export function createProject(input, id = crypto.randomUUID()) {
  const name = String(input.name || '').trim();
  if (name.length < 3 || name.length > 80) throw new Error('نام پروژه باید بین ۳ تا ۸۰ کاراکتر باشد.');
  if (!['residential', 'commercial', 'industrial'].includes(input.type)) throw new Error('نوع پروژه را انتخاب کنید.');
  const estimate = calculateEstimate(input);
  return { id, name, city: input.city, type: input.type, area: estimate.area, floors: estimate.floors, structure: input.structure, quality: input.quality, budget: estimate.total, progress: 0, stage: 0, createdAt: new Date().toISOString() };
}

export const stages = ['طراحی و مجوزها', 'خاک‌برداری و فونداسیون', 'اجرای اسکلت', 'سفت‌کاری', 'تأسیسات', 'نازک‌کاری', 'تحویل پروژه'];
export const projectTypes = { residential: 'خانه مسکونی', commercial: 'ساختمان تجاری', industrial: 'پروژه صنعتی' };

export const materials = [
  {id:'steel',name:'میلگرد آجدار سایز ۱۶',category:'آهن‌آلات',unit:'کیلوگرم',price:46500,change:1.2,visual:'steel',brand:'ذوب آهن اصفهان'},
  {id:'cement',name:'سیمان پرتلند تیپ ۲',category:'سیمان',unit:'کیسه ۵۰ کیلویی',price:125000,change:-.8,visual:'cement',brand:'سیمان تهران'},
  {id:'brick',name:'آجر سفالی ۱۵ سانتی',category:'آجر و بلوک',unit:'عدد',price:8500,change:0,visual:'brick',brand:'آجر پارس'},
  {id:'pipe',name:'لوله پلی‌اتیلن ۳۲',category:'تأسیسات',unit:'متر',price:68000,change:.5,visual:'pipe',brand:'پلی‌رود'},
  {id:'sand',name:'ماسه شسته دوبار شور',category:'شن و ماسه',unit:'تن',price:480000,change:0,visual:'sand',brand:'معدن شهریار'},
  {id:'block',name:'بلوک سبک هبلکس',category:'آجر و بلوک',unit:'مترمکعب',price:1850000,change:-1.3,visual:'block',brand:'رضوی'}
];
export const suppliers = [
  {name:'ذوب آهن اصفهان',city:'اصفهان',price:46500,stock:true,delivery:'۲ روز کاری'},
  {name:'فولاد میانه',city:'تبریز',price:45200,stock:true,delivery:'۳ روز کاری'},
  {name:'فولاد بناب',city:'بناب',price:45800,stock:true,delivery:'۲ روز کاری'},
  {name:'فولاد کاوه',city:'تهران',price:47000,stock:false,delivery:'نامشخص'}
];
export const contractors = [
  {id:'pars',name:'شرکت عمران پارس',specialty:'ساخت‌وساز',city:'تهران',rating:4.8,projects:42,years:12,initial:'پ',color:'blue',bio:'طراحی و اجرای پروژه‌های مسکونی با تمرکز بر کیفیت اجرا، برنامه‌ریزی دقیق و گزارش‌دهی شفاف.'},
  {id:'arad',name:'گروه ساختمانی آراد',specialty:'بازسازی',city:'کرج',rating:4.7,projects:36,years:9,initial:'آ',color:'purple',bio:'بازسازی فضاهای مسکونی و تجاری؛ از طراحی داخلی تا اجرای جزئیات و تحویل نهایی.'},
  {id:'modern',name:'شرکت سازه مدرن',specialty:'سازه و تأسیسات',city:'تهران',rating:4.9,projects:58,years:15,initial:'م',color:'green',bio:'اجرای سازه‌های بتنی و فلزی، تأسیسات مکانیکی و برقی با تیم مهندسی متخصص.'},
  {id:'nama',name:'استودیو نمای آبی',specialty:'بازسازی',city:'اصفهان',rating:4.6,projects:24,years:7,initial:'ن',color:'orange',bio:'طراحی نما و بازسازی با رویکرد استفاده از مصالح بومی و بهینه‌سازی فضا.'}
];
export const articles = [
  {id:'steps',title:'از زمین خالی تا خانه رؤیایی',category:'مراحل ساخت',time:8,visual:'building',desc:'نقشه راهی روشن برای شروع اولین پروژه ساختمانی شما.',body:['شروع یک پروژه با شناخت زمین، بررسی اسناد و نیازسنجی آغاز می‌شود. پیش از خرید یا شروع عملیات، وضعیت حقوقی و ضوابط محلی را با متخصص مربوط بررسی کنید.','در مرحله طراحی، برنامه فیزیکی، بودجه و زمان‌بندی را با مهندس طراح هماهنگ کنید. دریافت مجوزها و تأیید نقشه‌ها باید پیش از اجرای عملیات انجام شود.','پس از آماده‌سازی کارگاه، اجرای فونداسیون، اسکلت، سفت‌کاری، تأسیسات و نازک‌کاری به ترتیب و زیر نظر عوامل دارای صلاحیت انجام می‌شود. برای هر مرحله صورت‌جلسه و گزارش پیشرفت نگه دارید.']},
  {id:'materials',title:'چطور مصالح مناسب انتخاب کنیم؟',category:'مصالح و تجهیزات',time:5,visual:'steel',desc:'کیفیت، استاندارد و هزینه را کنار هم بسنجید.',body:['انتخاب مصالح تنها مقایسه قیمت نیست. مشخصات فنی مصوب پروژه و استانداردهای لازم باید مبنای خرید باشند.','از تأمین‌کننده مشخصات محصول، فاکتور و مدارک کیفیت بخواهید. هزینه حمل، پرت و شرایط نگهداری را در بودجه خرید لحاظ کنید.','پیش از جایگزین کردن نوع یا برند مصالح، تأیید طراح یا ناظر مربوط را دریافت کنید. اطلاعات این راهنما عمومی است و جایگزین نظر تخصصی پروژه نیست.']},
  {id:'budget',title:'۵ قدم برای مدیریت هزینه ساخت',category:'نکات مهم',time:6,visual:'plan',desc:'بودجه‌ای واقع‌بینانه بنویسید و هزینه‌ها را کنترل کنید.',body:['بودجه را به بخش‌های طراحی، مجوز، مصالح، اجرا و هزینه‌های جانبی تقسیم کنید. هزینه زمین را جداگانه محاسبه کنید.','برای اتفاق‌های پیش‌بینی‌نشده ذخیره در نظر بگیرید. قیمت‌ها و زمان تحویل را پیش از هر خرید با فروشنده بررسی کنید.','مبلغ برآوردی، تعهدشده و پرداخت‌شده را جدا ثبت کنید. مرور هفتگی هزینه‌ها به شناسایی انحراف بودجه کمک می‌کند.']},
  {id:'contract',title:'قبل از قرارداد با پیمانکار بخوانید',category:'نکات مهم',time:7,visual:'plan',desc:'شرح کار روشن، شروع یک همکاری بهتر است.',body:['سوابق مرتبط و نمونه پروژه‌های پیمانکار را بررسی و در صورت امکان با کارفرمایان قبلی گفت‌وگو کنید.','شرح خدمات، روش پرداخت، زمان تحویل، مسئولیت تهیه مصالح و نحوه رسیدگی به تغییرات را روشن بنویسید.','متن قرارداد را برای شرایط خاص پروژه با مشاور حقوقی و فنی بررسی کنید. این مطلب راهنمای عمومی است و مشاوره حقوقی محسوب نمی‌شود.']}
];
export const faqs = [
  ['چطور می‌توانم یک پروژه جدید بسازم؟','از دکمه «پروژه جدید» استفاده کنید، نوع ساختمان را انتخاب کنید و مشخصات آن را وارد کنید. پروژه در همین مرورگر ذخیره می‌شود و از بخش پروژه‌های من در دسترس است.'],
  ['برآورد هزینه چقدر دقیق است؟','محاسبه بر اساس ضرایب نمونه، زیربنای کل، نوع سازه، کیفیت و شهر انجام می‌شود. هزینه زمین لحاظ نشده و ارقام قیمت روز یا پیشنهاد قطعی نیستند. برای بودجه نهایی از متخصص و تأمین‌کنندگان استعلام بگیرید.'],
  ['قیمت مصالح به‌روز است؟','قیمت‌های این نسخه داده نمایشی هستند و به منبع زنده متصل نیستند. بخش مقایسه، نحوه انتخاب تأمین‌کننده و ذخیره درخواست را نمایش می‌دهد.'],
  ['چطور با پیمانکار ارتباط بگیرم؟','در پروفایل پیمانکار «درخواست مشاوره» را انتخاب کنید. درخواست در این نسخه فقط در مرورگر ثبت می‌شود و برای کسی ارسال نمی‌شود.'],
  ['اطلاعات من کجا ذخیره می‌شود؟','پروژه‌ها، پروفایل و درخواست‌ها در حافظه محلی همین مرورگر ذخیره می‌شوند. برای نگهداری نسخه جداگانه از گزینه خروجی اطلاعات در تنظیمات استفاده کنید.'],
  ['آیا می‌توانم با موبایل از بیلتو استفاده کنم؟','بله؛ چیدمان برای موبایل، تبلت و دسکتاپ طراحی شده است. در مرورگرهای پشتیبان می‌توانید آن را به صفحه اصلی اضافه کنید.']
];
