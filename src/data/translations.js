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
    // The /resume page. Each item's dates and category are in data/timelineData.js
    timeline: {
      title: 'Timeline | Oscar Brenes',
      home: 'Home',
      kicker: 'Timeline',
      headline: {
        lead: 'The road ',
        highlight: 'so far',
      },
      intro: "Code, bikes, teams and a lot of kanji. Here's everything that got me here, newest first. Use the filters to follow just one side of the story.",
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
        text: "CTO chapter closed and Japanese course done. Now I'm looking for a place in Japan where design, technology and people meet.",
        cta: "Let's talk!",
      },
      footer: {
        text: "Have a project or opportunity in mind? I'd love to hear about it.",
        back: 'Back to home',
      },
      items: {
        arc: {
          title: 'Back to school, in Japanese',
          org: 'ARC Academy',
          role: 'Japanese language student',
          summary: 'A year and a half studying Japanese in Japan. Passed the JLPT N4 and made it to N3-level classes. Keigo and I are still negotiating.',
          tags: ['Japanese', 'JLPT N4'],
        },
        buzz: {
          title: 'From new hire to CTO in three months',
          org: 'Buzz',
          role: 'Senior frontend developer\u00a0→ CTO',
          summary: 'I joined to lead frontend projects, and three months later I was building the tech department from scratch: hiring, budget, processes and KPIs, with a remote team of developers and designers.',
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
          title: 'Seven and a half years of leveling up',
          org: 'Critical Mass',
          role: 'Production designer\u00a0→ Content developer\u00a0→ Frontend developer',
          summary: 'I started doing production design for GoDaddy and ended up building the technology behind the BMW USA website. Along the way I became second in command of the content team. Fun fact: it was called Hangar back then.',
          path: ['Production designer for GoDaddy', 'Content developer for BMW USA', 'Frontend developer for BMW USA'],
          details: [
            'Second in command of the content department: coordinated the work and represented the team with other areas.',
            'Created and taught Adobe Experience Manager training; the team earned several certifications.',
            'Worked with creative, business and QA teams to ship digital projects for GoDaddy and BMW USA.',
          ],
          tags: ['Frontend', 'AEM', 'Content', 'Training'],
        },
        tec: {
          title: 'Making the coaching official',
          org: 'Costa Rica Institute of Technology (TEC)',
          role: 'Sports management technician',
          summary: 'While running Clean Cycling, I went back to class to learn the management side of sport.',
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
          title: 'Coaching the next generation',
          org: 'Los Santos C&R',
          role: 'Sports director & coach',
          summary: 'My first team as a coach: young riders, developed as athletes and as people. National titles followed, and so did the idea of becoming a foundation.',
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
          summary: 'Websites and graphic design for my own clients while I was still studying. Real clients and real deadlines turned out to be great teachers.',
          tags: ['Web design', 'Graphic design'],
        },
        acica: {
          title: 'Last seasons as a racer',
          org: 'ACICA',
          role: 'Road cyclist',
          summary: 'My final competitive seasons, on the road.',
        },
        mtbAssociation: {
          title: 'Backstage at the national MTB cup',
          org: 'Asociación Nacional de MTB',
          role: 'Event operations',
          summary: "Schedules, registrations and staff for Costa Rica's National MTB Cup, plus designing the XCO and XCC race courses. Lots of mud, lots of logistics.",
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
          summary: 'Started riding road and mountain bikes. Spoiler: it led to racing, coaching and a foundation.',
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
    timeline: {
      title: 'タイムライン | オスカル・ブレネス',
      home: 'ホーム',
      kicker: 'タイムライン',
      headline: {
        lead: 'これまでの',
        highlight: '道のり',
      },
      intro: 'コード、自転車、チーム、そしてたくさんの漢字。ここに至るまでの歩みを、新しい順にまとめました。フィルターを使えば、気になる分野だけをたどることもできます。',
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
        text: 'CTOとしての役目を終え、日本語学校も修了しました。今は日本で、デザインとテクノロジー、そして人が交わる場所を探しています。',
        cta: 'お気軽にご連絡ください',
      },
      footer: {
        text: 'プロジェクトやお仕事のお話があれば、ぜひお聞かせください。',
        back: 'ホームに戻る',
      },
      items: {
        arc: {
          title: '日本語で、もう一度学生に',
          org: 'ARC Academy',
          role: '日本語学校の学生',
          summary: '日本で1年半、日本語を勉強しました。JLPT N4に合格し、N3レベルのクラスまで進みました。敬語とはまだ交渉中です。',
          tags: ['日本語', 'JLPT N4'],
        },
        buzz: {
          title: '入社3か月でCTOに',
          org: 'Buzz',
          role: 'シニアフロントエンド開発者\u00a0→ CTO',
          summary: 'フロントエンドのプロジェクトを率いるために入社し、3か月後にはテクノロジー部門をゼロから立ち上げることに。採用、予算、プロセス、KPIまで、リモートの開発・デザインチームとともに作り上げました。',
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
          title: '7年半、一歩ずつレベルアップ',
          org: 'Critical Mass',
          role: 'プロダクションデザイナー\u00a0→ コンテンツ開発者\u00a0→ フロントエンド開発者',
          summary: 'GoDaddyのプロダクションデザインから始まり、最後はBMW USAのウェブサイトを支える技術を担当。その間に、コンテンツチームのナンバー2にもなりました。ちなみに当時の社名はHangarでした。',
          path: ['プロダクションデザイナー（GoDaddy）', 'コンテンツ開発者（BMW USA）', 'フロントエンド開発者（BMW USA）'],
          details: [
            'コンテンツ部門のナンバー2として業務を調整し、他部署に対してチームを代表。',
            'Adobe Experience Managerの研修を作成・実施し、チームで複数の認定資格を取得。',
            'クリエイティブ、ビジネス、QAの各チームと連携し、GoDaddyとBMW USAのデジタルプロジェクトを届けました。',
          ],
          tags: ['フロントエンド', 'AEM', 'コンテンツ', '研修'],
        },
        tec: {
          title: 'コーチングを、学問としても',
          org: 'コスタリカ工科大学（TEC）',
          role: 'スポーツマネジメント専門課程',
          summary: 'Clean Cyclingを運営しながら、スポーツのマネジメントを学ぶためにもう一度教室へ。',
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
          title: '次の世代を育てる',
          org: 'Los Santos C&R',
          role: '監督・コーチ',
          summary: 'コーチとして初めて率いたチーム。若い選手たちを、アスリートとしても人としても育てることを大切にしました。全国タイトルを重ね、やがて財団という次のステップにつながりました。',
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
          summary: '学生時代から、自分のクライアント向けにウェブサイトやグラフィックを制作していました。本物のクライアントと締め切りは、最高の先生でした。',
          tags: ['ウェブデザイン', 'グラフィックデザイン'],
        },
        acica: {
          title: '選手としての最後のシーズン',
          org: 'ACICA',
          role: 'ロードレース選手',
          summary: '競技者としての最後のシーズンを、ロードで走りました。',
        },
        mtbAssociation: {
          title: '全国MTBカップの舞台裏',
          org: 'Asociación Nacional de MTB',
          role: '大会運営',
          summary: 'コスタリカ全国MTBカップで、スケジュール、エントリー、スタッフの調整を担当し、XCOとXCCのコース設計も手がけました。泥だらけで、段取りだらけの日々。',
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
          summary: 'ロードバイクとマウンテンバイクに乗り始めました。ネタバレすると、これがのちにレース、コーチング、そして財団へとつながっていきます。',
        },
      },
    },
  },
}
