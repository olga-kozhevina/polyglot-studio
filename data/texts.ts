import { TextMaterial } from '@/types/text';

export const TEXT_MATERIALS: TextMaterial[] = [
  // --- ENGLISH (EN) ---
  {
    id: 'en-b1-tech-1',
    title: 'How Artificial Intelligence Works',
    description: 'An introductory guide to basic machine learning concepts and daily application.',
    targetLanguage: 'EN',
    level: 'B1',
    category: 'Technology',
    tagsRu: ['искусственный интеллект', 'нейросети', 'роботы', 'компьютеры', 'технологии', 'ит'],
    duration: 16,
    wordCount: 42,
    audioUrl: '/audio/en-b1-tech-1.mp3',
    sentences: [
      {
        id: 's1',
        startTime: 0.0,
        endTime: 4.2,
        text: 'Artificial intelligence is changing the way we live and work every single day.'
      },
      {
        id: 's2',
        startTime: 4.5,
        endTime: 10.1,
        text: 'Computers can now process large amounts of data to find patterns and make predictions.'
      },
      {
        id: 's3',
        startTime: 10.5,
        endTime: 16,
        text: 'By learning simple algorithms, beginners can understand how modern smart devices operate.'
      }
    ]
  },
  {
    id: 'en-b2-biz-1',
    title: 'The Future of Remote Work Culture',
    description: 'Analyzing performance metrics, async communication, and work-life balance.',
    targetLanguage: 'EN',
    level: 'B2',
    category: 'Business',
    tagsRu: ['удаленка', 'работа', 'офис', 'бизнес', 'карьера', 'продуктивность', 'менеджмент'],
    duration: 17.0,
    wordCount: 46,
    audioUrl: '/audio/en-b2-biz-1.mp3',
    sentences: [
      {
        id: 's1',
        startTime: 0.0,
        endTime: 5.5,
        text: 'Transitioning to distributed teams requires transparent async communication protocols.'
      },
      {
        id: 's2',
        startTime: 6.0,
        endTime: 11.2,
        text: 'Companies must focus on measurable outcomes rather than tracking active screen hours.'
      },
      {
        id: 's3',
        startTime: 11.9,
        endTime: 17.0,
        text: 'Sustainable remote culture relies heavily on psychological safety and clear boundaries.'
      }
    ]
  },
  {
    id: 'en-c1-culture-1',
    title: 'Architectural Heritage and Modern Urbanism',
    description: 'Lectures on preserving historical identity within rapidly expanding metropolises.',
    targetLanguage: 'EN',
    level: 'C1',
    category: 'Culture',
    tagsRu: ['архитектура', 'история', 'город', 'культура', 'достопримечательности', 'строительство'],
    duration: 21.0,
    wordCount: 45,
    audioUrl: '/audio/en-c1-culture-1.mp3',
    sentences: [
      {
        id: 's1',
        startTime: 0.0,
        endTime: 5.8,
        text: 'The dichotomy between historical preservation and aggressive urban development triggers fierce debates.'
      },
      {
        id: 's2',
        startTime: 6.1,
        endTime: 13.0,
        text: 'Metropolises often struggle to seamlessly integrate centuries-old landmarks with contemporary infrastructure.'
      },
      {
        id: 's3',
        startTime: 13.5,
        endTime: 21.0,
        text: 'Preserving intangible cultural heritage demands adaptive reuse strategies rather than mere museumification.'
      }
    ]
  },

  // --- FRENCH (FR) ---
  {
    id: 'fr-b1-culture-1',
    title: 'La Gastronomie Française au Quotidien',
    description: 'Découvrez l’importance des repas traditionnels et des marchés locaux en France.',
    targetLanguage: 'FR',
    level: 'B1',
    category: 'Culture',
    tagsRu: ['кухня', 'еда', 'гастрономия', 'традиции', 'франция', 'париж', 'продукты'],
    duration: 12.0,
    wordCount: 38,
    audioUrl: '/audio/fr-b1-culture-1.mp3',
    sentences: [
      {
        id: 's1',
        startTime: 0.0,
        endTime: 4.0,
        text: 'En France, la nourriture est une partie essentielle de la vie quotidienne.'
      },
      {
        id: 's2',
        startTime: 4.2,
        endTime: 7.0,
        text: 'Les gens aiment acheter des produits frais au marché le weekend.'
      },
      {
        id: 's3',
        startTime: 7.2,
        endTime: 12.0,
        text: 'Partager un repas en famille reste une tradition très importante pour beaucoup.'
      }
    ]
  },
  {
    id: 'fr-b2-tech-1',
    title: 'L’Évolution des Énergies Renouvelables',
    description: 'Une analyse sur la transition énergétique et les nouvelles technologies vertes.',
    targetLanguage: 'FR',
    level: 'B2',
    category: 'Technology',
    tagsRu: ['зеленая энергия', 'экология', 'технологии', 'солнце', 'ветер', 'электричество', 'европа'],
    duration: 14.1,
    wordCount: 41,
    audioUrl: '/audio/fr-b2-tech-1.mp3',
    sentences: [
      {
        id: 's1',
        startTime: 0.0,
        endTime: 3.2,
        text: 'La transition vers des sources d’énergie propres accélère dans toute l’Europe.'
      },
      {
        id: 's2',
        startTime: 3.8,
        endTime: 8.1,
        text: 'Les innovations dans le stockage par batterie permettent de mieux gérer l’intermittence.'
      },
      {
        id: 's3',
        startTime: 8.5,
        endTime: 14.1,
        text: 'Investir dans les technologies vertes devient indispensable pour réduire l’empreinte carbone.'
      }
    ]
  },
  {
    id: 'fr-c1-biz-1',
    title: 'L’Impact de l’Intelligence Artificielle sur l’Économie',
    description: 'Une conférence sur la transformation du marché du travail et la souveraineté numérique.',
    targetLanguage: 'FR',
    level: 'C1',
    category: 'Business',
    tagsRu: ['переработка', 'бизнес', 'экология', 'экономика', 'производство', 'вторсырье', 'промышленность'],
    duration: 24.5,
    wordCount: 48,
    audioUrl: '/audio/fr-c1-biz-1.mp3',
    sentences: [
      {
        id: 's1',
        startTime: 0.0,
        endTime: 5.9,
        text: 'L’automatisation progressive des processus décisionnels bouleverse fondamentalement les modèles économiques traditionnels.'
      },
      {
        id: 's2',
        startTime: 6.2,
        endTime: 12.1,
        text: 'Les entreprises doivent faire face à des enjeux éthiques majeurs tout en garantissant la compétitivité internationale.'
      },
      {
        id: 's3',
        startTime: 12.8,
        endTime: 18.0,
        text: 'La régulation des données massives constitue désormais un levier stratégique pour la souveraineté industrielle.'
      }
    ]
  },

  // --- TURKISH (TR) ---
  {
    id: 'tr-b1-tech-1',
    title: 'Dijital Dünyada Yeni Teknolojiler',
    description: 'Günlük hayatta kullandığımız akıllı cihazlar ve internetin gelişimi.',
    targetLanguage: 'TR',
    level: 'B1',
    category: 'Technology',
    tagsRu: ['чай', 'кофе', 'стамбул', 'турция', 'традиции', 'культура', 'гостеприимство', 'напитки'],
    duration: 16.1,
    wordCount: 34,
    audioUrl: '/audio/tr-b1-tech-1.mp3',
    sentences: [
      {
        id: 's1',
        startTime: 0.0,
        endTime: 3.3,
        text: 'Teknoloji her geçen gün hayatımızı daha da kolaylaştırıyor.'
      },
      {
        id: 's2',
        startTime: 4.0,
        endTime: 10.1,
        text: 'Akıllı telefonlar sayesinde bilgiye ulaşmak artık sadece birkaç saniye sürüyor.'
      },
      {
        id: 's3',
        startTime: 11.0,
        endTime: 16.1,
        text: 'İnternet kullanımı, insanların iletişim kurma biçimini tamamen değiştirdi.'
      }
    ]
  },
  {
    id: 'tr-b2-culture-1',
    title: 'İstanbul’un Tarihi ve Mimari Mirası',
    description: 'Doğu ile Batı’nın kesişim noktasındaki kültürel zenginlikler ve şehir kültürü.',
    targetLanguage: 'TR',
    level: 'B2',
    category: 'Culture',
    tagsRu: ['умный город', 'транспорт', 'автобус', 'трафик', 'технологии', 'метро', 'автоматизация'],
    duration: 19.5,
    wordCount: 41,
    audioUrl: '/audio/tr-b2-culture-1.mp3',
    sentences: [
      {
        id: 's1',
        startTime: 0.0,
        endTime: 5.5,
        text: 'İstanbul, yüzyıllar boyunca farklı medeniyetlere ev sahipliği yapmış eşsiz bir şehirdir.'
      },
      {
        id: 's2',
        startTime: 6.1,
        endTime: 11.9,
        text: 'Boğaz’ın iki yakasındaki tarihi yapılar, geçmiş ile günümüz arasında bir köprü kurar.'
      },
      {
        id: 's3',
        startTime: 12.3,
        endTime: 19.5,
        text: 'Şehrin kültürel çeşitliliği, hem mimaride hem de günlük yaşam alışkanlıklarında belirgin şekilde hissedilir.'
      }
    ]
  },
  {
    id: 'tr-c1-biz-1',
    title: 'Girişimcilik ve Küresel Pazarlar',
    description: 'Uluslararası pazarlara açılma stratejileri ve kriz yönetimi üzerine derinlemesine inceleme.',
    targetLanguage: 'TR',
    level: 'C1',
    category: 'Business',
    tagsRu: ['стартап', 'бизнес', 'инвестиции', 'цифровизация', 'рынок', 'технологии', 'торговля'],
    duration: 20.0,
    wordCount: 39,
    audioUrl: '/audio/tr-c1-biz-1.mp3',
    sentences: [
      {
        id: 's1',
        startTime: 0.0,
        endTime: 6.2,
        text: 'Küresel pazarlarda rekabet edebilmek için sürdürülebilir inovasyon stratejileri geliştirmek şarttır.'
      },
      {
        id: 's2',
        startTime: 7.0,
        endTime: 13.0,
        text: 'Girişimcilerin finansal riskleri doğru analiz edip esnek kriz yönetim modelleri uygulaması gerekir.'
      },
      {
        id: 's3',
        startTime: 13.8,
        endTime: 20.0,
        text: 'Pazar dinamiklerine hızlı uyum sağlayan ölçeklenebilir şirketler uzun vadede başarıyı yakalar.'
      }
    ]
  }
];