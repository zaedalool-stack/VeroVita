import { useState } from 'react';
import { MessageSquareHeart, Lightbulb, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';

export default function FeedbackSuggestions() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'feedback' | 'suggestion'>('feedback');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      showToast(t('Please enter a message', 'يرجى إدخال رسالة'), 'warning');
      return;
    }

    setSubmitting(true);
    const table = activeTab === 'feedback' ? 'feedback' : 'suggestions';
    const { error } = await supabase.from(table).insert({
      name: name.trim() || null,
      message: message.trim(),
    });

    setSubmitting(false);

    if (error) {
      showToast(t('Failed to submit. Please try again.', 'فشل الإرسال. حاول مرة أخرى.'), 'error');
      return;
    }

    setSubmitted(true);
    showToast(
      activeTab === 'feedback'
        ? t('Thank you for your feedback!', 'شكراً لملاحظاتك!')
        : t('Thank you for your suggestion!', 'شكراً لاقتراحك!'),
      'success'
    );
    setName('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="feedback" className="py-20 sm:py-28 bg-gradient-to-b from-cream-100 to-cream-50">
      <div className="container-x">
        <div className="text-center mb-10">
          <h2 className="section-title mb-3">
            {t('We\'d Love to Hear From You', 'نسعد بسماع رأيك')}
          </h2>
          <p className="section-subtitle">
            {t(
              'Share your feedback or suggest something new. Your voice helps us improve.',
              'شاركنا رأيك أو اقترح شيئاً جديداً. صوتك يساعدنا على التحسن.'
            )}
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-2 p-1.5 rounded-2xl bg-white shadow-soft mb-6">
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'feedback'
                  ? 'bg-green-600 text-cream-50 shadow-soft'
                  : 'text-green-600 hover:bg-green-50'
              }`}
            >
              <MessageSquareHeart className="h-4 w-4" />
              {t('Feedback', 'ملاحظات')}
            </button>
            <button
              onClick={() => setActiveTab('suggestion')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'suggestion'
                  ? 'bg-caramel-500 text-cream-50 shadow-soft'
                  : 'text-caramel-600 hover:bg-caramel-50'
              }`}
            >
              <Lightbulb className="h-4 w-4" />
              {t('Suggestion', 'اقتراح')}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-4">
            {submitted && (
              <div className="flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3 animate-fade-in">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <p className="text-sm font-semibold text-green-700">
                  {t('Submitted successfully!', 'تم الإرسال بنجاح!')}
                </p>
              </div>
            )}

            <div>
              <label className="label">
                {t('Your Name (optional)', 'اسمك (اختياري)')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('Enter your name', 'أدخل اسمك')}
                className="input"
                maxLength={100}
              />
            </div>

            <div>
              <label className="label">
                {activeTab === 'feedback' ? t('Your Feedback', 'ملاحظاتك') : t('Your Suggestion', 'اقتراحك')}
                <span className="text-error">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  activeTab === 'feedback'
                    ? t('Share your experience with us...', 'شاركنا تجربتك...')
                    : t('What would you like us to add?', 'ماذا تود أن نضيف؟')
                }
                className="input min-h-[120px] resize-y"
                maxLength={1000}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={activeTab === 'feedback' ? 'btn-primary w-full' : 'btn-secondary w-full'}
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  {t('Sending...', 'جار الإرسال...')}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {t('Submit', 'إرسال')}
                </>
              )}
            </button>

            <p className="text-xs text-center text-green-400">
              {t('Your submission is private and only seen by our team.', 'إرسالك خاص ويراه فريقنا فقط.')}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
