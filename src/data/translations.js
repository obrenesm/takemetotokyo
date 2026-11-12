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
      // The button that closes the dialog (it's drawn as an X)
      close: 'Close',
      // Under the form, {email}, {linkedin} and {journey} are links ({journey} says journeyLink)
      elsewhere: 'You can also email me at {email} or find me on {linkedin}. If you want to know more about my background, check out my {journey}.',
      journeyLink: 'journey timeline',
      // The small button next to the e-mail, and what it says for a moment after a click
      copy: {
        label: 'Copy email address',
        copied: 'Copied!',
        failed: "Couldn't copy",
      },
      form: {
        // Above the fields (the same sentence as the end of /journey)
        intro: "Have a project or opportunity in mind? I'd love to hear about it.",
        name: 'Name',
        email: 'Email',
        message: 'Message',
        submit: 'Send message',
        sending: 'Sending…',
        errors: {
          nameRequired: 'Please tell me your name.',
          emailRequired: 'Please enter your email so I can reply.',
          emailInvalid: "That email doesn't look right. It should look like name@example.com.",
          messageRequired: 'Please write a message.',
          tooLong: 'Please keep it under {max} characters.',
        },
        // Shown above the button, {email} is a link
        alerts: {
          verifying: "The security check isn't done yet. Give it a moment (or tick its box) and send again.",
          verification: "The security check didn't go through. It's running again, please send once more in a moment.",
          unavailable: "The security check couldn't load, so the form can't be sent right now. Please email me at {email} instead.",
          failed: "Sorry, your message couldn't be sent. Please try again in a moment, or email me at {email}.",
        },
        sent: {
          title: 'Message sent!',
          text: "Thanks, {name}! I'll get back to you at {email} soon.",
        },
      },
      // At the bottom of the dialog, {link} says creditsLink and opens /credits. The link text has
      // to say where it goes on its own: "click here" fails Lighthouse's descriptive link text check
      creditsDisclaimer: 'I used and modified assets under a creative commons license. If you want to check the authors, or just see what I modified, have a look at the {link}.',
      creditsLink: 'credits for the 3D models',
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
    // The /journey page. Each item's dates and category are in data/timelineData.js
    timeline: {
      title: 'Timeline | Oscar Brenes',
      home: 'Home',
      kicker: 'Timeline',
      headline: {
        lead: 'The road ',
        highlight: 'so far',
      },
      intro: 'Code, bikes, community, and a bit of kanji in the mix. Everything that shaped my journey, listed from newest to oldest. Filter by category to explore just one side of the story.',
      filters: {
        label: 'Show',
        all: 'All',
        status: 'Showing {shown} of {total}',
      },
      categories: {
        work: 'Work',
        volunteering: 'Volunteering',
        studies: 'Studies',
        cycling: 'Cycling',
      },
      listLabel: 'Activities, newest first',
      more: 'More',
      less: 'Less',
      // Names of the More/Less buttons for screen readers, {title} is the card's title
      moreAbout: 'More: {title}',
      lessAbout: 'Less: {title}',
      path: 'Roles',
      overview: 'Overview',
      overviewHint: 'Click a bar to jump to it',
      now: {
        label: 'Now',
        title: 'Next stop: Japan',
        text: "I recently left my position as CTO to focus on establishing a long-term future in Japan. While I'm still learning the language, I'm already seeking opportunities that let me bridge design, tech, and community-driven projects, bonus points if it involves my passion for cycling!",
        cta: "Let's talk!",
      },
      footer: {
        text: "Have a project or opportunity in mind? I'd love to hear about it.",
        back: 'Back to home',
      },
      items: {
        japanRide: {
          title: 'Seeing Japan at bike speed',
          org: 'Tokyo → Nagasaki → Nagoya',
          role: 'Bike tour',
          summary: 'Once I finished my Japanese studies, before heading back to Costa Rica, I decided to see part of Japan by bike: from Tokyo all the way to Nagasaki, and back to Nagoya.',
          tags: ['2,874 km', '22,799 m of climbing', '161 h in the saddle'],
          map: {
            label: 'Route map: from Tokyo to Nagasaki and back to Nagoya',
            start: 'Start',
            finish: 'Finish',
            startPlace: 'Tokyo',
            turnPlace: 'Nagasaki',
            finishPlace: 'Nagoya',
          },
        },
        arc: {
          title: 'Back to school, in Japanese',
          org: 'ARC Academy',
          role: 'Japanese language student',
          summary: 'A year and a half studying Japanese in Tokyo. Passed the JLPT N4 and made it to N3-level classes. Keigo and I are still negotiating.',
          tags: ['Japanese', 'JLPT N4'],
        },
        buzz: {
          title: 'Stepping into the CTO role',
          org: 'Buzz',
          role: 'Senior frontend developer\u00a0→ CTO',
          summary: 'Stepping up from Frontend Lead to CTO within three months was an incredible vote of confidence. I took on the challenge of building our internal tech department from the ground up, from recruiting a talented team to setting up budgets, workflows, and KPIs, while keeping and improving the department relations with key clients.',
          path: ['Senior frontend developer', 'CTO'],
          details: [
            'Set up the department from zero: hiring, budget, workflows and performance indicators.',
            'Led and supported a remote, cross-disciplinary team of developers and designers.',
            'Wrote a two-year roadmap to grow what the department could take on.',
            'Technical advisor to clients, and the one coordinating the response when things got critical.',
            'Picked improvement initiatives by their real impact on the business.',
            'Before that, as senior frontend developer: ran several projects at once, did estimates and feasibility analysis, mentored, and pushed for better quality and accessibility.',
          ],
          tags: ['Leadership', 'Hiring', 'Budgets', 'Roadmaps', 'Mentoring'],
        },
        udacity: {
          title: 'Responsive web design, responsive images and JavaScript',
          org: 'Udacity',
        },
        criticalMass: {
          title: 'Seven and a half years of growth',
          org: 'Critical Mass',
          role: 'Production designer\u00a0→ Content developer\u00a0→ Frontend developer',
          summary: 'Evolving through design, frontend engineering, and having some leadership provided a complete perspective of the digital process, from early visual execution to technical delivery and team management.',
          path: ['Production designer for GoDaddy', 'Content developer for BMW USA', 'Frontend developer for BMW USA'],
          details: [
            'Second in command of the content department: coordinated the work and represented the team with other areas.',
            'Created and taught Adobe Experience Manager training; the team earned several certifications.',
            'Worked with creative, business and QA teams to ship digital projects for GoDaddy and BMW USA.',
          ],
          tags: ['Frontend', 'AEM', 'Content', 'Training'],
        },
        tec: {
          title: 'Professionalizing the initiative',
          org: 'Costa Rica Institute of Technology (TEC)',
          role: 'Sports management technician',
          summary: 'While leading Clean Cycling, I studied Sports Management trying to equip our volunteer initiative with the operational and strategic framework it needed to grow sustainably.',
          tags: ['Sports management'],
        },
        la404: {
          title: 'Digital marketing, JavaScript and UX',
          org: 'La 404',
        },
        cleanCycling: {
          title: 'Turning a cycling team into a foundation',
          org: 'Clean Cycling',
          role: 'Founder, sports director & coach',
          summary: 'We turned Los Santos C&R into a foundation for young riders, mostly from low-income families. The recipe: good training, staying in school and racing clean. The riders won national titles, and everyone who stayed in the program went on to higher education.',
          details: [
            'Designed and ran a pilot program that combined sports training, support to stay in school and anti-doping values.',
            'Coached riders who won multiple national championships.',
            "Drafted a nationwide expansion plan that used technology to train coaches and follow each athlete's progress.",
          ],
          tags: ['Coaching', 'Social impact', 'Clean sport', 'Program design'],
        },
        losSantos: {
          title: 'Empowering youth through sport',
          org: 'Los Santos C&R',
          role: 'Sports director & coach',
          summary: 'Invited to establish a youth cycling initiative in a mountain region, I mentored young riders as both athletes and individuals. Bringing home national titles was meaningful, but the holistic impact on their lives was what made it deeply fulfilling, and ultimately led to creating a foundation.',
          details: [
            'Ran a cycling team focused on developing young talent, on and off the bike.',
            'Prepared riders for competition and followed their progress.',
            'Helped the team win multiple national championships.',
            "Pushed the team's evolution into a foundation for sport, education and community.",
          ],
          tags: ['Coaching', 'Team management'],
        },
        uci: {
          title: 'Cycling coach, level 1',
          org: 'Union Cycliste Internationale (UCI)',
          summary: 'The official stamp, right before I started coaching.',
        },
        creativa: {
          title: 'Where I learned to build for the web',
          org: 'Creativa University',
          role: 'Web design & development technician',
          summary: 'Design, HTML, CSS and JavaScript. The tech side of my career started here.',
          tags: ['Web design', 'Frontend'],
        },
        freelance: {
          title: 'Learning on real projects',
          org: 'Freelance',
          role: 'Web & graphic designer',
          summary: 'While still studying, I began taking on independent graphic design projects, building a portfolio that spanned small businesses and high-profile clients like Deloitte and the National Olympic Committee. Managing real clients and live deadlines early on proved to be my greatest classroom.',
          tags: ['Web design', 'Graphic design'],
        },
        acica: {
          title: 'The Road Years',
          org: 'ACICA',
          role: 'Road cyclist',
          summary: 'I spent my final three seasons focused on road racing.',
        },
        mtbAssociation: {
          title: 'National MTB Cup: Track Design & Operations',
          org: 'Asociación Nacional de MTB',
          role: 'Event operations',
          summary: "Designed and physically built the XCO and XCC technical courses for Costa Rica's National MTB Cup. Alongside hands-on track construction, I lent a hand with event logistics, staff management, and race administration.",
          tags: ['Events', 'Logistics', 'Course design'],
        },
        covao: {
          title: 'High school, with a design twist',
          org: 'COVAO',
          role: 'High school diploma + graphic design technician',
          summary: 'A technical high school: I graduated with my diploma and a graphic design degree at the same time.',
          tags: ['Graphic design'],
        },
        cartago: {
          title: 'Racing for Cartago',
          org: 'Comité Cantonal de Deporte y Recreación de Cartago',
          role: 'Road & MTB cyclist',
          summary: 'Road and mountain bike races for Cartago. My first years of competition.',
        },
        firstBike: {
          title: 'Hooked on bikes',
          summary: 'From very early I started riding and casually racing mountain bikes. Spoiler: it led to racing, coaching and a foundation.',
        },
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
      close: '閉じる',
      elsewhere: '{email}へのメールや、{linkedin}からもご連絡いただけます。これまでの歩みは{journey}でご覧いただけます。',
      journeyLink: 'タイムライン',
      copy: {
        label: 'メールアドレスをコピー',
        copied: 'コピーしました',
        failed: 'コピーできませんでした',
      },
      form: {
        intro: 'プロジェクトやお仕事のお話があれば、ぜひお聞かせください。',
        name: 'お名前',
        email: 'メールアドレス',
        message: 'メッセージ',
        submit: '送信する',
        sending: '送信中…',
        errors: {
          nameRequired: 'お名前を入力してください。',
          emailRequired: '返信先のメールアドレスを入力してください。',
          emailInvalid: 'メールアドレスの形式をご確認ください（例：name@example.com）。',
          messageRequired: 'メッセージを入力してください。',
          tooLong: '{max}文字以内で入力してください。',
        },
        alerts: {
          verifying: 'セキュリティチェックがまだ完了していません。少し待つか、チェックボックスを押してから、もう一度送信してください。',
          verification: 'セキュリティチェックを通過できませんでした。チェックをやり直していますので、少し待ってからもう一度送信してください。',
          unavailable: 'セキュリティチェックを読み込めなかったため、現在フォームから送信できません。お手数ですが、{email}までメールでご連絡ください。',
          failed: '申し訳ありません、メッセージを送信できませんでした。少し時間をおいてもう一度お試しいただくか、{email}までメールでご連絡ください。',
        },
        sent: {
          title: '送信しました！',
          text: '{name}さん、ありがとうございます！{email}宛てに、近いうちにお返事します。',
        },
      },
      creditsDisclaimer: 'このサイトでは、クリエイティブ・コモンズ・ライセンスの素材を使用・改変しています。作者や変更内容は、{link}でご覧いただけます。',
      creditsLink: '3Dモデルのクレジットページ',
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
    timeline: {
      title: 'タイムライン | オスカル・ブレネス',
      home: 'ホーム',
      kicker: 'タイムライン',
      headline: {
        lead: 'これまでの',
        highlight: '道のり',
      },
      intro: 'コード、自転車、コミュニティ、そして少しの漢字。これまでの歩みを形づくってきたものを、新しい順に並べました。カテゴリーで絞り込めば、ひとつの側面だけをたどることもできます。',
      filters: {
        label: '表示',
        all: 'すべて',
        status: '全{total}件中{shown}件を表示',
      },
      categories: {
        work: '仕事',
        volunteering: 'ボランティア',
        studies: '学び',
        cycling: '自転車',
      },
      listLabel: '活動の一覧（新しい順）',
      more: '詳しく見る',
      less: '閉じる',
      moreAbout: '詳しく見る：{title}',
      lessAbout: '閉じる：{title}',
      path: '役職の変遷',
      overview: '全体像',
      overviewHint: 'バーをクリックすると、その項目へ移動します',
      now: {
        label: '現在',
        title: '次の行き先：日本',
        text: '最近CTOの職を離れ、日本で長く暮らしていく基盤づくりに集中しています。まだ日本語を勉強中ですが、デザイン、テクノロジー、そしてコミュニティから生まれるプロジェクトをつなぐ機会を、すでに探し始めています。自転車への情熱も活かせたら、なお嬉しいです！',
        cta: 'お気軽にご連絡ください',
      },
      footer: {
        text: 'プロジェクトやお仕事のお話があれば、ぜひお聞かせください。',
        back: 'ホームに戻る',
      },
      items: {
        japanRide: {
          title: '自転車のスピードで見た日本',
          org: '東京 → 長崎 → 名古屋',
          role: '自転車旅',
          summary: '日本語の勉強を終えたあと、コスタリカに戻る前に、自転車で日本の一部を巡ることにしました。東京から長崎まで走り、名古屋まで戻ってきました。',
          tags: ['2,874 km', '獲得標高 22,799 m', '走行時間 161時間'],
          map: {
            label: 'ルートマップ：東京から長崎へ、そして名古屋まで',
            start: 'スタート',
            finish: 'ゴール',
            startPlace: '東京',
            turnPlace: '長崎',
            finishPlace: '名古屋',
          },
        },
        arc: {
          title: '日本語で、もう一度学生に',
          org: 'ARC Academy',
          role: '日本語学校の学生',
          summary: '東京で1年半、日本語を勉強しました。JLPT N4に合格し、N3レベルのクラスまで進みました。敬語とはまだ交渉中です。',
          tags: ['日本語', 'JLPT N4'],
        },
        buzz: {
          title: 'CTOという役割へ',
          org: 'Buzz',
          role: 'シニアフロントエンド開発者\u00a0→ CTO',
          summary: '入社から3か月でフロントエンドリードからCTOに抜擢されたことは、大きな信頼の証でした。社内のテクノロジー部門をゼロから築くという挑戦に取り組み、優秀なチームの採用から予算、業務フロー、KPIの整備までを手がけながら、主要クライアントとの関係を維持・強化しました。',
          path: ['シニアフロントエンド開発者', 'CTO'],
          details: [
            '採用、予算、業務プロセス、評価指標まで、部門をゼロから構築。',
            '開発者とデザイナーからなるリモートの混成チームをリード・サポート。',
            '部門の対応力を広げるための2か年ロードマップを策定。',
            'クライアントの技術アドバイザーを務め、重大なトラブルの際は対応を指揮。',
            'ビジネスへのインパクトを基準に、改善施策や機会を選定。',
            'それ以前はシニアフロントエンド開発者として、複数プロジェクトの並行進行、見積もりや実現可能性の検討、メンタリング、品質とアクセシビリティの改善を担当。',
          ],
          tags: ['リーダーシップ', '採用', '予算管理', 'ロードマップ', 'メンタリング'],
        },
        udacity: {
          title: 'レスポンシブウェブデザイン、レスポンシブ画像、JavaScript',
          org: 'Udacity',
        },
        criticalMass: {
          title: '7年半の成長',
          org: 'Critical Mass',
          role: 'プロダクションデザイナー\u00a0→ コンテンツ開発者\u00a0→ フロントエンド開発者',
          summary: 'デザイン、フロントエンド開発、そしてリーダーシップを経験したことで、初期のビジュアル制作から技術的な実装、チームマネジメントまで、デジタル制作のプロセス全体を見渡せるようになりました。',
          path: ['プロダクションデザイナー（GoDaddy）', 'コンテンツ開発者（BMW USA）', 'フロントエンド開発者（BMW USA）'],
          details: [
            'コンテンツ部門のナンバー2として業務を調整し、他部署に対してチームを代表。',
            'Adobe Experience Managerの研修を作成・実施し、チームで複数の認定資格を取得。',
            'クリエイティブ、ビジネス、QAの各チームと連携し、GoDaddyとBMW USAのデジタルプロジェクトを届けました。',
          ],
          tags: ['フロントエンド', 'AEM', 'コンテンツ', '研修'],
        },
        tec: {
          title: '取り組みを、プロの仕組みに',
          org: 'コスタリカ工科大学（TEC）',
          role: 'スポーツマネジメント専門課程',
          summary: 'Clean Cyclingを率いながらスポーツマネジメントを学び、ボランティアの取り組みが持続的に成長するための、運営面と戦略面の土台づくりを目指しました。',
          tags: ['スポーツマネジメント'],
        },
        la404: {
          title: 'デジタルマーケティング、JavaScript、UX',
          org: 'La 404',
        },
        cleanCycling: {
          title: '自転車チームを財団に',
          org: 'Clean Cycling',
          role: '創設者・監督・コーチ',
          summary: 'Los Santos C&Rを、主に低所得家庭の若い選手を支える財団へと発展させました。大切にしたのは、しっかりしたトレーニング、学業の継続、そしてクリーンなレース。選手たちは全国タイトルを獲得し、プログラムに残った全員が高等教育へ進みました。',
          details: [
            '競技トレーニング、学業継続のサポート、アンチ・ドーピングの価値観を組み合わせたパイロットプログラムを設計・運営。',
            '複数の全国選手権タイトルを獲得した選手たちを指導。',
            'テクノロジーを活用してコーチを育成し、選手一人ひとりの成長を追う全国展開プランを作成。',
          ],
          tags: ['コーチング', '社会貢献', 'クリーンスポーツ', 'プログラム設計'],
        },
        losSantos: {
          title: 'スポーツで若者に力を',
          org: 'Los Santos C&R',
          role: '監督・コーチ',
          summary: '山間部の地域で若者向けの自転車プロジェクトを立ち上げてほしいと声をかけられ、若い選手たちをアスリートとしても一人の人間としても指導しました。全国タイトルの獲得にも大きな意味がありましたが、何より心に残ったのは、彼らの人生全体に与えられた影響です。その経験が、やがて財団の設立へとつながりました。',
          details: [
            '競技の内外で若い才能を育てる自転車チームを指揮。',
            '選手のレース準備と、競技面での成長をサポート。',
            '複数の全国選手権タイトル獲得に貢献。',
            'スポーツ・教育・地域社会を軸とした財団への発展を推進。',
          ],
          tags: ['コーチング', 'チームマネジメント'],
        },
        uci: {
          title: '自転車競技コーチ レベル1',
          org: '国際自転車競技連合（UCI）',
          summary: 'コーチを始める直前に取得した公式資格。',
        },
        creativa: {
          title: 'ウェブづくりの原点',
          org: 'Creativa University',
          role: 'ウェブデザイン・開発専門課程',
          summary: 'デザイン、HTML、CSS、JavaScript。キャリアのテクノロジー面は、ここから始まりました。',
          tags: ['ウェブデザイン', 'フロントエンド'],
        },
        freelance: {
          title: '実際のプロジェクトで学ぶ',
          org: 'フリーランス',
          role: 'ウェブ・グラフィックデザイナー',
          summary: '学生のうちからフリーランスでグラフィックデザインの仕事を受け始め、小さなビジネスから、Deloitteや国内オリンピック委員会といった大きなクライアントまで、幅広いポートフォリオを築きました。早くから本物のクライアントと締め切りに向き合った経験が、最高の学びの場になりました。',
          tags: ['ウェブデザイン', 'グラフィックデザイン'],
        },
        acica: {
          title: 'ロードレースの日々',
          org: 'ACICA',
          role: 'ロードレース選手',
          summary: '選手としての最後の3シーズンは、ロードレースに打ち込みました。',
        },
        mtbAssociation: {
          title: '全国MTBカップ：コース設計と大会運営',
          org: 'Asociación Nacional de MTB',
          role: '大会運営',
          summary: 'コスタリカ全国MTBカップで、XCOとXCCのテクニカルコースを設計し、自らの手で造成しました。コースづくりに加えて、大会のロジスティクス、スタッフの管理、レース運営もサポートしました。',
          tags: ['イベント運営', 'ロジスティクス', 'コース設計'],
        },
        covao: {
          title: 'デザインも学んだ高校時代',
          org: 'COVAO',
          role: '高校卒業資格・グラフィックデザイン専門課程',
          summary: '技術系の高校で、卒業資格とグラフィックデザインの資格を同時に取得しました。',
          tags: ['グラフィックデザイン'],
        },
        cartago: {
          title: 'カルタゴ代表としてレースへ',
          org: 'Comité Cantonal de Deporte y Recreación de Cartago',
          role: 'ロード・MTB選手',
          summary: 'カルタゴの代表として、ロードとマウンテンバイクのレースに出場。競技人生の始まりです。',
        },
        firstBike: {
          title: '自転車にハマる',
          summary: 'かなり早い時期からマウンテンバイクに乗り始め、気軽にレースにも出るようになりました。ネタバレすると、これがのちにレース、コーチング、そして財団へとつながっていきます。',
        },
      },
    },
  },
}
