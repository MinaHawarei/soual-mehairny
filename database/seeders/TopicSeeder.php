<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Topic;

class TopicSeeder extends Seeder
{
    public function run(): void
    {
        $topics = [
            [
                'name_ar' => 'الثالوث المقدس',
                'name_en' => 'Holy Trinity',
                'slug' => 'holy-trinity',
                'description_ar' => 'أسئلة حول الثالوث المقدس: الآب والابن والروح القدس',
                'description_en' => 'Questions about the Holy Trinity: Father, Son, and Holy Spirit'
            ],
            [
                'name_ar' => 'طبيعة المسيح',
                'name_en' => 'Nature of Christ',
                'slug' => 'nature-of-christ',
                'description_ar' => 'أسئلة حول الطبيعة الإلهية والإنسانية للمسيح',
                'description_en' => 'Questions about the divine and human nature of Christ'
            ],
            [
                'name_ar' => 'الخلاص',
                'name_en' => 'Salvation',
                'slug' => 'salvation',
                'description_ar' => 'أسئلة حول الخلاص والخلاص الأبدي',
                'description_en' => 'Questions about salvation and eternal life'
            ],
            [
                'name_ar' => 'الأسرار المقدسة',
                'name_en' => 'Holy Sacraments',
                'slug' => 'holy-sacraments',
                'description_ar' => 'أسئلة حول الأسرار السبعة المقدسة',
                'description_en' => 'Questions about the seven holy sacraments'
            ],
            [
                'name_ar' => 'الكتاب المقدس',
                'name_en' => 'Holy Bible',
                'slug' => 'holy-bible',
                'description_ar' => 'أسئلة حول تفسير وفهم الكتاب المقدس',
                'description_en' => 'Questions about Bible interpretation and understanding'
            ],
            [
                'name_ar' => 'التقليد الكنسي',
                'name_en' => 'Church Tradition',
                'slug' => 'church-tradition',
                'description_ar' => 'أسئلة حول التقليد الكنسي والتعاليم الرسولية',
                'description_en' => 'Questions about church tradition and apostolic teachings'
            ],
            [
                'name_ar' => 'الليتورجيا',
                'name_en' => 'Liturgy',
                'slug' => 'liturgy',
                'description_ar' => 'أسئلة حول القداس الإلهي والطقوس الكنسية',
                'description_en' => 'Questions about the Divine Liturgy and church services'
            ],
            [
                'name_ar' => 'القديسين',
                'name_en' => 'Saints',
                'slug' => 'saints',
                'description_ar' => 'أسئلة حول القديسين وحياتهم',
                'description_en' => 'Questions about saints and their lives'
            ],
            [
                'name_ar' => 'الكنيسة',
                'name_en' => 'Church',
                'slug' => 'church',
                'description_ar' => 'أسئلة حول طبيعة الكنيسة ودورها',
                'description_en' => 'Questions about the nature and role of the Church'
            ],
            [
                'name_ar' => 'الأخلاق المسيحية',
                'name_en' => 'Christian Ethics',
                'slug' => 'christian-ethics',
                'description_ar' => 'أسئلة حول الأخلاق والقيم المسيحية',
                'description_en' => 'Questions about Christian ethics and values'
            ],
            [
                'name_ar' => 'الموت والحياة الأبدية',
                'name_en' => 'Death and Eternal Life',
                'slug' => 'death-and-eternal-life',
                'description_ar' => 'أسئلة حول الموت والحياة بعد الموت',
                'description_en' => 'Questions about death and life after death'
            ],
            [
                'name_ar' => 'الصلاة',
                'name_en' => 'Prayer',
                'slug' => 'prayer',
                'description_ar' => 'أسئلة حول الصلاة وأشكالها',
                'description_en' => 'Questions about prayer and its forms'
            ],
            [
                'name_ar' => 'الصوم',
                'name_en' => 'Fasting',
                'slug' => 'fasting',
                'description_ar' => 'أسئلة حول الصوم وأوقاته',
                'description_en' => 'Questions about fasting and fasting periods'
            ],
            [
                'name_ar' => 'الأيقونات',
                'name_en' => 'Icons',
                'slug' => 'icons',
                'description_ar' => 'أسئلة حول الأيقونات ودورها في العبادة',
                'description_en' => 'Questions about icons and their role in worship'
            ],
            [
                'name_ar' => 'المجمعات المسكونية',
                'name_en' => 'Ecumenical Councils',
                'slug' => 'ecumenical-councils',
                'description_ar' => 'أسئلة حول المجمعات المسكونية وقراراتها',
                'description_en' => 'Questions about ecumenical councils and their decisions'
            ],
            [
                'name_ar' => 'الهرطقات',
                'name_en' => 'Heresies',
                'slug' => 'heresies',
                'description_ar' => 'أسئلة حول الهرطقات التاريخية والحديثة',
                'description_en' => 'Questions about historical and modern heresies'
            ],
            [
                'name_ar' => 'العلوم والفلسفة',
                'name_en' => 'Science and Philosophy',
                'slug' => 'science-and-philosophy',
                'description_ar' => 'أسئلة حول العلاقة بين العلم والفلسفة والإيمان',
                'description_en' => 'Questions about the relationship between science, philosophy, and faith'
            ],
            [
                'name_ar' => 'الأسرة والزواج',
                'name_en' => 'Family and Marriage',
                'slug' => 'family-and-marriage',
                'description_ar' => 'أسئلة حول الأسرة المسيحية والزواج',
                'description_en' => 'Questions about Christian family and marriage'
            ],
            [
                'name_ar' => 'التعليم المسيحي',
                'name_en' => 'Christian Education',
                'slug' => 'christian-education',
                'description_ar' => 'أسئلة حول التعليم المسيحي والتربية',
                'description_en' => 'Questions about Christian education and upbringing'
            ],
            [
                'name_ar' => 'الخدمة الاجتماعية',
                'name_en' => 'Social Service',
                'slug' => 'social-service',
                'description_ar' => 'أسئلة حول الخدمة الاجتماعية والعمل الخيري',
                'description_en' => 'Questions about social service and charity work'
            ]
        ];

        foreach ($topics as $topic) {
            Topic::create($topic);
        }
    }
}
