// Every visible text, aria-label and <title> of the site, one dictionary per language.
// {placeholders} are filled with React elements by t() (see providers/languageProvider.js),
// so links, tooltips and buttons can sit anywhere in the sentence for each language.
// Brand and proper names (Critical Mass, Buzz, BMW USA, LinkedIn, the e-mail) stay as they are.

export const LANGUAGES = ['en', 'ja']
export const DEFAULT_LANGUAGE = 'en'

export const translations = {
  en: {
    meta: {
      title: 'Oscar Brenes',
    },
    // Shown on the language button while the site is in the OTHER language,
    // that's why each one is written in its own language
    languageSwitch: {
      name: 'English',
      label: 'View in English',
    },
    nav: {
      contact: 'Contact Me',
    },
    cursor: {
      next: 'Next',
      back: 'Back',
    },
    scrollDown: 'swipe to scroll',
    home: {
      headline: {
        lead: 'Take me — ',
        highlight: 'Japan',
      },
      cr: {
        intro: "Hi! I'm Oscar, from Costa Rica. I recently wrapped up my role as CTO at Buzz, after more than seven years with {criticalMass}.",
        criticalMassTooltip: 'Previously know as Hangar, and latter fully integrated as part of Critical Mass',
        career: "My career has taken me from a small creative team to building the technology behind the BMW USA website, and eventually leading an entire department. Along the way, I've developed a passion for connecting design, technology, and people.",
      },
      jpn: {
        visit: 'I first visited Japan almost 8 years ago and quickly felt a connection with the country. Last year, I returned as a language student, and that experience made one thing clear: I want to build my life here.',
        opportunities: "I'm excited to explore opportunities where my professional experience and personal interests come together. Have a project or opportunity in mind? {cta}",
        cta: "Let's talk!",
      },
    },
    contact: {
      title: "Let's talk!",
      creditsDisclaimer: 'I used and modified assets under a creative commons license. If you want to check the authors, or just see what I modified {link}',
      creditsLink: 'click here',
    },
    credits: {
      title: 'Credits',
      intro: 'I used and modified this two 3D files under the Attribution-NonCommercial 4.0 International license',
      airplane: {
        name: 'Airplane',
        author: 'by mizda3d',
        changes: 'Modified the colors and changed the animation',
      },
      planet: {
        name: 'Planet Earth',
        author: 'by BamPistache',
        changes: 'Updated the shape for Costa Rica and Japan, replaced the water sphere, and changed the colors',
      },
    },
  },

  ja: {
    meta: {
      title: 'オスカル・ブレネス | Oscar Brenes',
    },
    languageSwitch: {
      name: '日本語',
      label: '日本語で表示',
    },
    nav: {
      contact: 'お問い合わせ',
    },
    cursor: {
      next: '次へ',
      back: '戻る',
    },
    scrollDown: 'スワイプで次へ',
    home: {
      headline: {
        lead: '連れてって、',
        highlight: '日本へ',
      },
      cr: {
        intro: 'こんにちは！コスタリカ出身のオスカルです。{criticalMass}での7年以上にわたるキャリアを経て、最近、BuzzでのCTOとしての役目を終えました。',
        criticalMassTooltip: '旧社名はHangar。のちにCritical Massに完全統合されました。',
        career: 'キャリアの始まりは小さなクリエイティブチーム。そこからBMW USAのウェブサイトを支える技術づくりに携わり、やがて部門全体を率いるまでになりました。その中で、デザインとテクノロジー、そして人をつなぐことに情熱を感じるようになりました。',
      },
      jpn: {
        visit: '初めて日本を訪れたのは8年近く前のこと。すぐにこの国とのつながりを感じました。昨年は日本語学校の学生として再び来日し、その経験を通してひとつはっきりしたことがあります。それは、ここ日本で人生を築いていきたいということです。',
        opportunities: 'これまでの仕事の経験と個人的な関心が重なるような機会を、これから探していくのが楽しみです。プロジェクトやお仕事のお話があれば、{cta}。',
        cta: 'お気軽にご連絡ください',
      },
    },
    contact: {
      // ​ (zero-width space) lets the title wrap between the two words on narrow screens
      title: 'お気軽に​ご連絡ください',
      creditsDisclaimer: 'このサイトでは、クリエイティブ・コモンズ・ライセンスの素材を使用・改変しています。作者や変更内容は{link}からご覧いただけます。',
      creditsLink: 'こちら',
    },
    credits: {
      title: 'クレジット',
      intro: '以下の2つの3Dモデルを、クリエイティブ・コモンズ 表示 - 非営利 4.0 国際 ライセンス（CC BY-NC 4.0）のもとで使用・改変しています。',
      airplane: {
        name: '飛行機',
        author: '制作：mizda3d',
        changes: '配色とアニメーションを変更しました。',
      },
      planet: {
        name: '地球',
        author: '制作：BamPistache',
        changes: 'コスタリカと日本の形状を調整し、海を表す球体を差し替えて、配色を変更しました。',
      },
    },
  },
}
