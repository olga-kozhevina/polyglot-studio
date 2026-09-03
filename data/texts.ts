import { TextMaterial } from '@/types/text';

export const TEXT_MATERIALS: TextMaterial[] = [
  // --- ENGLISH (EN) ---
  {
    id: 'en-b1-tech',
    title: 'How Artificial Intelligence Works',
    description: 'An introductory guide to basic machine learning concepts and daily application.',
    targetLanguage: 'EN',
    level: 'B1',
    category: 'Technology',
    tagsRu: ['искусственный интеллект', 'нейросети', 'роботы', 'компьютеры', 'технологии', 'ит'],
    duration: 18.5,
    wordCount: 42,
    audioUrl: '/audio/en-b1-tech.mp3',
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
        endTime: 18.5,
        text: 'By learning simple algorithms, beginners can understand how modern smart devices operate.'
      }
    ]
  },
  {
    id: 'en-b2-biz',
    title: 'The Future of Remote Work Culture',
    description: 'Analyzing performance metrics, async communication, and work-life balance.',
    targetLanguage: 'EN',
    level: 'B2',
    category: 'Business',
    tagsRu: ['удаленка', 'работа', 'офис', 'бизнес', 'карьера', 'продуктивность', 'менеджмент'],
    duration: 21.0,
    wordCount: 46,
    audioUrl: '/audio/en-b2-biz.mp3',
    sentences: [
      {
        id: 's1',
        startTime: 0.0,
        endTime: 6.8,
        text: 'Transitioning to distributed teams requires transparent async communication protocols.'
      },
      {
        id: 's2',
        startTime: 7.2,
        endTime: 13.5,
        text: 'Companies must focus on measurable outcomes rather than tracking active screen hours.'
      },
      {
        id: 's3',
        startTime: 14.0,
        endTime: 21.0,
        text: 'Sustainable remote culture relies heavily on psychological safety and clear boundaries.'
      }
    ]
  },
  {
    id: 'en-c1-culture',
    title: 'Architectural Heritage and Modern Urbanism',
    description: 'Lectures on preserving historical identity within rapidly expanding metropolises.',
    targetLanguage: 'EN',
    level: 'C1',
    category: 'Culture',
    tagsRu: ['архитектура', 'история', 'город', 'культура', 'достопримечательности', 'строительство'],
    duration: 23.4,
    wordCount: 45,
    audioUrl: '/audio/en-c1-culture.mp3',
    sentences: [
      {
        id: 's1',
        startTime: 0.0,
        endTime: 7.5,
        text: 'The dichotomy between historical preservation and aggressive urban development triggers fierce debates.'
      },
      {
        id: 's2',
        startTime: 8.0,
        endTime: 15.2,
        text: 'Metropolises often struggle to seamlessly integrate centuries-old landmarks with contemporary infrastructure.'
      },
      {
        id: 's3',
        startTime: 15.8,
        endTime: 23.4,
        text: 'Preserving intangible cultural heritage demands adaptive reuse strategies rather than mere museumification.'
      }
    ]
  },

  // --- FRENCH (FR) ---
  {
    id: 'fr-b1-culture',
    title: 'La Gastronomie Française au Quotidien',
    description: 'Découvrez l’importance des repas traditionnels et des marchés locaux en France.',
    targetLanguage: 'FR',
    level: 'B1',
    category: 'Culture',
    tagsRu: ['кухня', 'еда', 'гастрономия', 'традиции', 'франция', 'париж', 'продукты'],
    duration: 17.8,
    wordCount: 38,
    audioUrl: '/audio/fr-b1-culture.mp3',
    sentences: [
      {
        id: 's1',
        startTime: 0.0,
        endTime: 5.1,
        text: 'En France, la nourriture est une partie essentielle de la vie quotidienne.'
      },
      {
        id: 's2',
        startTime: 5.5,
        endTime: 11.3,
        text: 'Les gens aiment acheter des produits frais au marché le weekend.'
      },
      {
        id: 's3',
        startTime: 11.8,
        endTime: 17.8,
        text: 'Partager un repas en famille reste une tradition très importante pour beaucoup.'
      }
    ]
  },
  {
    id: 'fr-b2-tech',
    title: 'L’Évolution des Énergies Renouvelables',
    description: 'Une analyse sur la transition énergétique et les nouvelles technologies vertes.',
    targetLanguage: 'FR',
    level: 'B2',
    category: 'Technology',
    tagsRu: ['зеленая энергия', 'экология', 'технологии', 'солнце', 'ветер', 'электричество', 'европа'],
    duration: 20.2,
    wordCount: 41,
    audioUrl: '/audio/fr-b2-tech.mp3',
    sentences: [
      {
        id: 's1',
        startTime: 0.0,
        endTime: 6.2,
        text: 'La transition vers des sources d’énergie propres accélère dans toute l’Europe.'
      },
      {
        id: 's2',
        startTime: 6.8,
        endTime: 13.0,
        text: 'Les innovations dans le stockage par batterie permettent de mieux gérer l’intermittence.'
      },
      {
        id: 's3',
        startTime: 13.5,
        endTime: 20.2,
        text: 'Investir dans les technologies vertes devient indispensable pour réduire l’empreinte carbone.'
      }
    ]
  },
  {
    id: 'fr-c1-biz',
    title: 'L’Impact de l’Intelligence Artificielle sur l’Économie',
    description: 'Une conférence sur la transformation du marché du travail et la souveraineté numérique.',
    targetLanguage: 'FR',
    level: 'C1',
    category: 'Business',
    tagsRu: ['переработка', 'бизнес', 'экология', 'экономика', 'производство', 'вторсырье', 'промышленность'],
    duration: 24.5,
    wordCount: 48,
    audioUrl: '/audio/fr-c1-biz.mp3',
    sentences: [
      {
        id: 's1',
        startTime: 0.0,
        endTime: 7.8,
        text: 'L’automatisation progressive des processus décisionnels bouleverse fondamentalement les modèles économiques traditionnels.'
      },
      {
        id: 's2',
        startTime: 8.2,
        endTime: 16.0,
        text: 'Les entreprises doivent faire face à des enjeux éthiques majeurs tout en garantissant la compétitivité internationale.'
      },
      {
        id: 's3',
        startTime: 16.5,
        endTime: 24.5,
        text: 'La régulation des données massives constitue désormais un levier stratégique pour la souveraineté industrielle.'
      }
    ]
  },

  // --- TURKISH (TR) ---
  {
    id: 'tr-b1-tech',
    title: 'Dijital Dünyada Yeni Teknolojiler',
    description: 'Günlük hayatta kullandığımız akıllı cihazlar ve internetin gelişimi.',
    targetLanguage: 'TR',
    level: 'B1',
    category: 'Technology',
    tagsRu: ['чай', 'кофе', 'стамбул', 'турция', 'традиции', 'культура', 'гостеприимство', 'напитки'],
    duration: 16.5,
    wordCount: 34,
    audioUrl: '/audio/tr-b1-tech.mp3',
    sentences: [
      {
        id: 's1',
        startTime: 0.0,
        endTime: 5.0,
        text: 'Teknoloji her geçen gün hayatımızı daha da kolaylaştırıyor.'
      },
      {
        id: 's2',
        startTime: 5.4,
        endTime: 10.8,
        text: 'Akıllı telefonlar sayesinde bilgiye ulaşmak artık sadece birkaç saniye sürüyor.'
      },
      {
        id: 's3',
        startTime: 11.2,
        endTime: 16.5,
        text: 'İnternet kullanımı, insanların iletişim kurma biçimini tamamen değiştirdi.'
      }
    ]
  },
  {
    id: 'tr-b2-culture',
    title: 'İstanbul’un Tarihi ve Mimari Mirası',
    description: 'Doğu ile Batı’nın kesişim noktasındaki kültürel zenginlikler ve şehir kültürü.',
    targetLanguage: 'TR',
    level: 'B2',
    category: 'Culture',
    tagsRu: ['умный город', 'транспорт', 'автобус', 'трафик', 'технологии', 'метро', 'автоматизация'],
    duration: 19.8,
    wordCount: 41,
    audioUrl: '/audio/tr-b2-culture.mp3',
    sentences: [
      {
        id: 's1',
        startTime: 0.0,
        endTime: 6.2,
        text: 'İstanbul, yüzyıllar boyunca farklı medeniyetlere ev sahipliği yapmış eşsiz bir şehirdir.'
      },
      {
        id: 's2',
        startTime: 6.6,
        endTime: 13.1,
        text: 'Boğaz’ın iki yakasındaki tarihi yapılar, geçmiş ile günümüz arasında bir köprü kurar.'
      },
      {
        id: 's3',
        startTime: 13.5,
        endTime: 19.8,
        text: 'Şehrin kültürel çeşitliliği, hem mimaride hem de günlük yaşam alışkanlıklarında belirgin şekilde hissedilir.'
      }
    ]
  },
  {
    id: 'tr-c1-biz',
    title: 'Girişimcilik ve Küresel Pazarlar',
    description: 'Uluslararası pazarlara açılma stratejileri ve kriz yönetimi üzerine derinlemesine inceleme.',
    targetLanguage: 'TR',
    level: 'C1',
    
    category: 'Business',
    tagsRu: ['стартап', 'бизнес', 'инвестиции', 'цифровизация', 'рынок', 'технологии', 'торговля'],
    duration: 22.1,
    wordCount: 39,
    audioUrl: '/audio/tr-c1-biz.mp3',
    sentences: [
      {
        id: 's1',
        startTime: 0.0,
        endTime: 7.1,
        text: 'Küresel pazarlarda rekabet edebilmek için sürdürülebilir inovasyon stratejileri geliştirmek şarttır.'
      },
      {
        id: 's2',
        startTime: 7.5,
        endTime: 14.3,
        text: 'Girişimcilerin finansal riskleri doğru analiz edip esnek kriz yönetim modelleri uygulaması gerekir.'
      },
      {
        id: 's3',
        startTime: 14.8,
        endTime: 22.1,
        text: 'Pazar dinamiklerine hızlı uyum sağlayan ölçeklenebilir şirketler uzun vadede başarıyı yakalar.'
      }
    ]
  }
];