<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Question;
use App\Models\BibleBook;
use App\Models\Topic;

class DemoQuestionSeeder extends Seeder
{
    public function run(): void
    {
        // Get some Bible books and topics for the demo questions
        $john = BibleBook::where('name_en', 'John')->first();
        $matthew = BibleBook::where('name_en', 'Matthew')->first();
        $trinity = Topic::where('slug', 'holy-trinity')->first();
        $salvation = Topic::where('slug', 'salvation')->first();
        $bible = Topic::where('slug', 'holy-bible')->first();

        $questions = [
            [
                'question_ar' => 'ما هو الثالوث المقدس وكيف يمكن فهمه؟',
                'question_en' => 'What is the Holy Trinity and how can it be understood?',
                'answer_ar' => 'الثالوث المقدس هو عقيدة أساسية في المسيحية الأرثوذكسية. نحن نؤمن بإله واحد في ثلاثة أقانيم: الآب والابن والروح القدس. كل أقنوم هو إله كامل، لكنهم ليسوا ثلاثة آلهة بل إله واحد. هذا سر إلهي يتجاوز فهم الإنسان المحدود، لكنه مكشوف لنا في الكتاب المقدس والتقليد الكنسي.',
                'answer_en' => 'The Holy Trinity is a fundamental doctrine in Orthodox Christianity. We believe in one God in three persons: Father, Son, and Holy Spirit. Each person is fully God, but they are not three gods but one God. This is a divine mystery that transcends human understanding, but it is revealed to us in Holy Scripture and church tradition.',
                'youtube_video_id' => null,
                'submitter_name' => 'مينا هواري',
                'submitter_email' => 'ahmed@example.com',
                'status' => 'approved',
                'bible_book_id' => $john ? $john->id : null,
                'topic_id' => $trinity ? $trinity->id : null,
                'chapter_verse' => 'يوحنا 1:1-3',
            ],
            [
                'question_ar' => 'كيف يحدث الخلاص في المسيحية الأرثوذكسية؟',
                'question_en' => 'How does salvation occur in Orthodox Christianity?',
                'answer_ar' => 'الخلاص في المسيحية الأرثوذكسية هو عملية مستمرة من التعاون بين الله والإنسان. نحن نؤمن أن الخلاص يبدأ بالمعمودية ويستمر من خلال الأسرار المقدسة والتوبة والصلاة وممارسة الفضائل. الخلاص ليس حدثاً لمرة واحدة بل رحلة روحية مدى الحياة نحو التأله (theosis) - أي الاتحاد مع الله.',
                'answer_en' => 'Salvation in Orthodox Christianity is an ongoing process of cooperation between God and man. We believe that salvation begins with baptism and continues through the holy sacraments, repentance, prayer, and the practice of virtues. Salvation is not a one-time event but a lifelong spiritual journey toward theosis - union with God.',
                'youtube_video_id' => null,
                'submitter_name' => 'مريم جورج',
                'submitter_email' => 'mary@example.com',
                'status' => 'approved',
                'bible_book_id' => $matthew ? $matthew->id : null,
                'topic_id' => $salvation ? $salvation->id : null,
                'chapter_verse' => 'متى 28:19-20',
            ],
            [
                'question_ar' => 'كيف نقرأ ونفهم الكتاب المقدس بشكل صحيح؟',
                'question_en' => 'How do we read and understand the Bible correctly?',
                'answer_ar' => 'قراءة الكتاب المقدس في التقليد الأرثوذكسي تتطلب فهماً للسياق التاريخي والثقافي، بالإضافة إلى التفسير الروحي. نحن نقرأ الكتاب المقدس في إطار التقليد الكنسي، مع الاستعانة بتفسيرات الآباء القديسين. من المهم أيضاً قراءة النصوص في سياقها الكامل وليس كآيات منفصلة.',
                'answer_en' => 'Reading the Bible in the Orthodox tradition requires understanding of historical and cultural context, as well as spiritual interpretation. We read the Bible within the framework of church tradition, drawing on the interpretations of the holy fathers. It is also important to read texts in their full context rather than as isolated verses.',
                'youtube_video_id' => null,
                'submitter_name' => 'جورج حنا',
                'submitter_email' => 'george@example.com',
                'status' => 'pending',
                'bible_book_id' => null,
                'topic_id' => $bible ? $bible->id : null,
                'chapter_verse' => null,
            ],
        ];

        foreach ($questions as $questionData) {
            Question::create($questionData);
        }
    }
}
