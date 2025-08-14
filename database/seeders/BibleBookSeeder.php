<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BibleBook;

class BibleBookSeeder extends Seeder
{
    public function run(): void
    {
        $books = [
            ['name_ar' => 'التكوين', 'name_en' => 'Genesis', 'abbreviation_ar' => 'تك', 'abbreviation_en' => 'Gen', 'order' => 1],
            ['name_ar' => 'الخروج', 'name_en' => 'Exodus', 'abbreviation_ar' => 'خر', 'abbreviation_en' => 'Exo', 'order' => 2],
            ['name_ar' => 'اللاويين', 'name_en' => 'Leviticus', 'abbreviation_ar' => 'لا', 'abbreviation_en' => 'Lev', 'order' => 3],
            ['name_ar' => 'العدد', 'name_en' => 'Numbers', 'abbreviation_ar' => 'عد', 'abbreviation_en' => 'Num', 'order' => 4],
            ['name_ar' => 'التثنية', 'name_en' => 'Deuteronomy', 'abbreviation_ar' => 'تث', 'abbreviation_en' => 'Deu', 'order' => 5],
            ['name_ar' => 'يشوع', 'name_en' => 'Joshua', 'abbreviation_ar' => 'يش', 'abbreviation_en' => 'Jos', 'order' => 6],
            ['name_ar' => 'القضاة', 'name_en' => 'Judges', 'abbreviation_ar' => 'قض', 'abbreviation_en' => 'Jdg', 'order' => 7],
            ['name_ar' => 'راعوث', 'name_en' => 'Ruth', 'abbreviation_ar' => 'را', 'abbreviation_en' => 'Rut', 'order' => 8],
            ['name_ar' => 'صموئيل الأول', 'name_en' => '1 Samuel', 'abbreviation_ar' => '1صم', 'abbreviation_en' => '1Sa', 'order' => 9],
            ['name_ar' => 'صموئيل الثاني', 'name_en' => '2 Samuel', 'abbreviation_ar' => '2صم', 'abbreviation_en' => '2Sa', 'order' => 10],
            ['name_ar' => 'الملوك الأول', 'name_en' => '1 Kings', 'abbreviation_ar' => '1مل', 'abbreviation_en' => '1Ki', 'order' => 11],
            ['name_ar' => 'الملوك الثاني', 'name_en' => '2 Kings', 'abbreviation_ar' => '2مل', 'abbreviation_en' => '2Ki', 'order' => 12],
            ['name_ar' => 'أخبار الأيام الأول', 'name_en' => '1 Chronicles', 'abbreviation_ar' => '1أخ', 'abbreviation_en' => '1Ch', 'order' => 13],
            ['name_ar' => 'أخبار الأيام الثاني', 'name_en' => '2 Chronicles', 'abbreviation_ar' => '2أخ', 'abbreviation_en' => '2Ch', 'order' => 14],
            ['name_ar' => 'عزرا', 'name_en' => 'Ezra', 'abbreviation_ar' => 'عز', 'abbreviation_en' => 'Ezr', 'order' => 15],
            ['name_ar' => 'نحميا', 'name_en' => 'Nehemiah', 'abbreviation_ar' => 'نح', 'abbreviation_en' => 'Neh', 'order' => 16],
            ['name_ar' => 'أستير', 'name_en' => 'Esther', 'abbreviation_ar' => 'أس', 'abbreviation_en' => 'Est', 'order' => 17],
            ['name_ar' => 'أيوب', 'name_en' => 'Job', 'abbreviation_ar' => 'أي', 'abbreviation_en' => 'Job', 'order' => 18],
            ['name_ar' => 'المزامير', 'name_en' => 'Psalms', 'abbreviation_ar' => 'مز', 'abbreviation_en' => 'Psa', 'order' => 19],
            ['name_ar' => 'أمثال سليمان', 'name_en' => 'Proverbs', 'abbreviation_ar' => 'أم', 'abbreviation_en' => 'Pro', 'order' => 20],
            ['name_ar' => 'الجامعة', 'name_en' => 'Ecclesiastes', 'abbreviation_ar' => 'جا', 'abbreviation_en' => 'Ecc', 'order' => 21],
            ['name_ar' => 'نشيد الأنشاد', 'name_en' => 'Song of Solomon', 'abbreviation_ar' => 'نش', 'abbreviation_en' => 'Sng', 'order' => 22],
            ['name_ar' => 'إشعياء', 'name_en' => 'Isaiah', 'abbreviation_ar' => 'إش', 'abbreviation_en' => 'Isa', 'order' => 23],
            ['name_ar' => 'إرميا', 'name_en' => 'Jeremiah', 'abbreviation_ar' => 'إر', 'abbreviation_en' => 'Jer', 'order' => 24],
            ['name_ar' => 'مراثي إرميا', 'name_en' => 'Lamentations', 'abbreviation_ar' => 'مر', 'abbreviation_en' => 'Lam', 'order' => 25],
            ['name_ar' => 'حزقيال', 'name_en' => 'Ezekiel', 'abbreviation_ar' => 'حز', 'abbreviation_en' => 'Ezk', 'order' => 26],
            ['name_ar' => 'دانيال', 'name_en' => 'Daniel', 'abbreviation_ar' => 'دا', 'abbreviation_en' => 'Dan', 'order' => 27],
            ['name_ar' => 'هوشع', 'name_en' => 'Hosea', 'abbreviation_ar' => 'هو', 'abbreviation_en' => 'Hos', 'order' => 28],
            ['name_ar' => 'يوئيل', 'name_en' => 'Joel', 'abbreviation_ar' => 'يؤ', 'abbreviation_en' => 'Jol', 'order' => 29],
            ['name_ar' => 'عاموس', 'name_en' => 'Amos', 'abbreviation_ar' => 'عا', 'abbreviation_en' => 'Amo', 'order' => 30],
            ['name_ar' => 'عوبديا', 'name_en' => 'Obadiah', 'abbreviation_ar' => 'عو', 'abbreviation_en' => 'Oba', 'order' => 31],
            ['name_ar' => 'يونان', 'name_en' => 'Jonah', 'abbreviation_ar' => 'يون', 'abbreviation_en' => 'Jon', 'order' => 32],
            ['name_ar' => 'ميخا', 'name_en' => 'Micah', 'abbreviation_ar' => 'مي', 'abbreviation_en' => 'Mic', 'order' => 33],
            ['name_ar' => 'ناحوم', 'name_en' => 'Nahum', 'abbreviation_ar' => 'نا', 'abbreviation_en' => 'Nah', 'order' => 34],
            ['name_ar' => 'حبقوق', 'name_en' => 'Habakkuk', 'abbreviation_ar' => 'حب', 'abbreviation_en' => 'Hab', 'order' => 35],
            ['name_ar' => 'صفنيا', 'name_en' => 'Zephaniah', 'abbreviation_ar' => 'صف', 'abbreviation_en' => 'Zep', 'order' => 36],
            ['name_ar' => 'حجي', 'name_en' => 'Haggai', 'abbreviation_ar' => 'حج', 'abbreviation_en' => 'Hag', 'order' => 37],
            ['name_ar' => 'زكريا', 'name_en' => 'Zechariah', 'abbreviation_ar' => 'زك', 'abbreviation_en' => 'Zec', 'order' => 38],
            ['name_ar' => 'ملاخي', 'name_en' => 'Malachi', 'abbreviation_ar' => 'مل', 'abbreviation_en' => 'Mal', 'order' => 39],
            ['name_ar' => 'متى', 'name_en' => 'Matthew', 'abbreviation_ar' => 'مت', 'abbreviation_en' => 'Mat', 'order' => 40],
            ['name_ar' => 'مرقس', 'name_en' => 'Mark', 'abbreviation_ar' => 'مر', 'abbreviation_en' => 'Mrk', 'order' => 41],
            ['name_ar' => 'لوقا', 'name_en' => 'Luke', 'abbreviation_ar' => 'لو', 'abbreviation_en' => 'Luk', 'order' => 42],
            ['name_ar' => 'يوحنا', 'name_en' => 'John', 'abbreviation_ar' => 'يو', 'abbreviation_en' => 'Jhn', 'order' => 43],
            ['name_ar' => 'أعمال الرسل', 'name_en' => 'Acts', 'abbreviation_ar' => 'أع', 'abbreviation_en' => 'Act', 'order' => 44],
            ['name_ar' => 'رومية', 'name_en' => 'Romans', 'abbreviation_ar' => 'رو', 'abbreviation_en' => 'Rom', 'order' => 45],
            ['name_ar' => 'كورنثوس الأولى', 'name_en' => '1 Corinthians', 'abbreviation_ar' => '1كو', 'abbreviation_en' => '1Co', 'order' => 46],
            ['name_ar' => 'كورنثوس الثانية', 'name_en' => '2 Corinthians', 'abbreviation_ar' => '2كو', 'abbreviation_en' => '2Co', 'order' => 47],
            ['name_ar' => 'غلاطية', 'name_en' => 'Galatians', 'abbreviation_ar' => 'غل', 'abbreviation_en' => 'Gal', 'order' => 48],
            ['name_ar' => 'أفسس', 'name_en' => 'Ephesians', 'abbreviation_ar' => 'أف', 'abbreviation_en' => 'Eph', 'order' => 49],
            ['name_ar' => 'فيلبي', 'name_en' => 'Philippians', 'abbreviation_ar' => 'في', 'abbreviation_en' => 'Php', 'order' => 50],
            ['name_ar' => 'كولوسي', 'name_en' => 'Colossians', 'abbreviation_ar' => 'كو', 'abbreviation_en' => 'Col', 'order' => 51],
            ['name_ar' => 'تسالونيكي الأولى', 'name_en' => '1 Thessalonians', 'abbreviation_ar' => '1تس', 'abbreviation_en' => '1Th', 'order' => 52],
            ['name_ar' => 'تسالونيكي الثانية', 'name_en' => '2 Thessalonians', 'abbreviation_ar' => '2تس', 'abbreviation_en' => '2Th', 'order' => 53],
            ['name_ar' => 'تيموثاوس الأولى', 'name_en' => '1 Timothy', 'abbreviation_ar' => '1تي', 'abbreviation_en' => '1Ti', 'order' => 54],
            ['name_ar' => 'تيموثاوس الثانية', 'name_en' => '2 Timothy', 'abbreviation_ar' => '2تي', 'abbreviation_en' => '2Ti', 'order' => 55],
            ['name_ar' => 'تيطس', 'name_en' => 'Titus', 'abbreviation_ar' => 'تي', 'abbreviation_en' => 'Tit', 'order' => 56],
            ['name_ar' => 'فليمون', 'name_en' => 'Philemon', 'abbreviation_ar' => 'فل', 'abbreviation_en' => 'Phm', 'order' => 57],
            ['name_ar' => 'العبرانيين', 'name_en' => 'Hebrews', 'abbreviation_ar' => 'عب', 'abbreviation_en' => 'Heb', 'order' => 58],
            ['name_ar' => 'يعقوب', 'name_en' => 'James', 'abbreviation_ar' => 'يع', 'abbreviation_en' => 'Jas', 'order' => 59],
            ['name_ar' => 'بطرس الأولى', 'name_en' => '1 Peter', 'abbreviation_ar' => '1بط', 'abbreviation_en' => '1Pe', 'order' => 60],
            ['name_ar' => 'بطرس الثانية', 'name_en' => '2 Peter', 'abbreviation_ar' => '2بط', 'abbreviation_en' => '2Pe', 'order' => 61],
            ['name_ar' => 'يوحنا الأولى', 'name_en' => '1 John', 'abbreviation_ar' => '1يو', 'abbreviation_en' => '1Jn', 'order' => 62],
            ['name_ar' => 'يوحنا الثانية', 'name_en' => '2 John', 'abbreviation_ar' => '2يو', 'abbreviation_en' => '2Jn', 'order' => 63],
            ['name_ar' => 'يوحنا الثالثة', 'name_en' => '3 John', 'abbreviation_ar' => '3يو', 'abbreviation_en' => '3Jn', 'order' => 64],
            ['name_ar' => 'يهوذا', 'name_en' => 'Jude', 'abbreviation_ar' => 'يه', 'abbreviation_en' => 'Jud', 'order' => 65],
            ['name_ar' => 'الرؤيا', 'name_en' => 'Revelation', 'abbreviation_ar' => 'رؤ', 'abbreviation_en' => 'Rev', 'order' => 66],
        ];

        foreach ($books as $book) {
            BibleBook::create($book);
        }
    }
}
