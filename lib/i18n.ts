export type Locale = "pt" | "en" | "es" | "fr";

export const locales: { code: Locale; name: string; flag: string }[] = [
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
];

const translations = {
    // ─── Navbar ───
    "nav.products": {
        pt: "Produtos", en: "Products", es: "Productos", fr: "Produits",
    },
    "nav.pricing": {
        pt: "Preços", en: "Pricing", es: "Precios", fr: "Tarifs",
    },
    "nav.faq": {
        pt: "FAQ", en: "FAQ", es: "FAQ", fr: "FAQ",
    },
    "nav.support": {
        pt: "Suporte", en: "Support", es: "Soporte", fr: "Support",
    },
    "nav.login": {
        pt: "Entrar", en: "Log in", es: "Iniciar sesión", fr: "Connexion",
    },
    "nav.getStarted": {
        pt: "Começar", en: "Get Started", es: "Empezar", fr: "Commencer",
    },

    // ─── Hero ───
    "hero.badge": {
        pt: "✦ A Plataforma #1 de Gaming", en: "✦ The #1 Gaming Platform", es: "✦ La Plataforma #1 de Gaming", fr: "✦ La Plateforme #1 de Gaming",
    },
    "hero.title1": {
        pt: "Produtos Gaming", en: "Digital Gaming", es: "Productos Gaming", fr: "Produits Gaming",
    },
    "hero.title2": {
        pt: "Digitais & Serviços", en: "Products & Services", es: "Digitales & Servicios", fr: "Numériques & Services",
    },
    "hero.subtitle": {
        pt: "Subscrições premium e produtos digitais para os teus jogos favoritos. Seguro, instantâneo e feito para gamers.",
        en: "Premium subscriptions and digital products for your favorite games. Secure, instant, and built for gamers.",
        es: "Suscripciones premium y productos digitales para tus juegos favoritos. Seguro, instantáneo y hecho para gamers.",
        fr: "Abonnements premium et produits numériques pour vos jeux préférés. Sécurisé, instantané et conçu pour les gamers.",
    },
    "hero.browse": {
        pt: "Ver Produtos", en: "Browse Products", es: "Ver Productos", fr: "Voir Produits",
    },
    "hero.viewPricing": {
        pt: "Ver Preços", en: "View Pricing", es: "Ver Precios", fr: "Voir Tarifs",
    },
    "hero.activeUsers": {
        pt: "Utilizadores Ativos", en: "Active Users", es: "Usuarios Activos", fr: "Utilisateurs Actifs",
    },
    "hero.uptime": {
        pt: "Disponibilidade", en: "Uptime", es: "Disponibilidad", fr: "Disponibilité",
    },
    "hero.rating": {
        pt: "Avaliação", en: "Rating", es: "Valoración", fr: "Évaluation",
    },

    // ─── Categories ───
    "categories.title": {
        pt: "Explorar por", en: "Browse by", es: "Explorar por", fr: "Parcourir par",
    },
    "categories.titleAccent": {
        pt: "Categoria", en: "Category", es: "Categoría", fr: "Catégorie",
    },
    "categories.subtitle": {
        pt: "Encontra exatamente o que precisas nas nossas categorias de produtos.",
        en: "Find exactly what you need across all our product categories.",
        es: "Encuentra exactamente lo que necesitas en nuestras categorías de productos.",
        fr: "Trouvez exactement ce dont vous avez besoin dans toutes nos catégories.",
    },
    "categories.products": {
        pt: "produtos", en: "products", es: "productos", fr: "produits",
    },
    "categories.defaultDesc": {
        pt: "Explora os melhores produtos digitais e serviços nesta categoria.",
        en: "Browse the best digital products and services in this category.",
        es: "Explora os melhores produtos digitales y servicios en esta categoría.",
        fr: "Explorez les meilleurs produits et services numériques de cette catégorie.",
    },

    // ─── Featured Products ───
    "featured.title": {
        pt: "Produtos em", en: "Featured", es: "Productos en", fr: "Produits en",
    },
    "featured.titleAccent": {
        pt: "Destaque", en: "Products", es: "Destacados", fr: "Vedette",
    },
    "featured.subtitle": {
        pt: "As nossas últimas novidades e produtos mais populares na loja.",
        en: "Our latest arrivals and most popular products in the shop.",
        es: "Nuestras últimas novedades y productos más populares en la tienda.",
        fr: "Nos dernières nouveautés et les produits les plus populaires du magasin.",
    },
    "featured.viewAll": {
        pt: "Ver Todos", en: "View All", es: "Ver Todos", fr: "Voir Tout",
    },
    // Category names
    "cat.gameAccounts": { pt: "Contas de Jogo", en: "Game Accounts", es: "Cuentas de Juego", fr: "Comptes de Jeu" },
    "cat.gameAccounts.desc": { pt: "Contas premium com itens raros e ranks altos", en: "Premium accounts with rare items and high ranks", es: "Cuentas premium con objetos raros y rangos altos", fr: "Comptes premium avec objets rares et rangs élevés" },
    "cat.inGameCurrency": { pt: "Moeda In-Game", en: "In-Game Currency", es: "Moneda del Juego", fr: "Monnaie In-Game" },
    "cat.inGameCurrency.desc": { pt: "V-Bucks, Robux, créditos e mais", en: "V-Bucks, Robux, credits and more", es: "V-Bucks, Robux, créditos y más", fr: "V-Bucks, Robux, crédits et plus" },
    "cat.boosting": { pt: "Serviços de Boost", en: "Boosting Services", es: "Servicios de Boost", fr: "Services de Boost" },
    "cat.boosting.desc": { pt: "Sobe de rank rapidamente com jogadores profissionais", en: "Rank up quickly with professional players", es: "Sube de rango rápidamente con jugadores profesionales", fr: "Montez en rang rapidement avec des joueurs professionnels" },
    "cat.gameKeys": { pt: "Chaves de Jogo", en: "Game Keys", es: "Claves de Juego", fr: "Clés de Jeu" },
    "cat.gameKeys.desc": { pt: "Códigos de ativação para PC e consola", en: "Activation codes for PC and console games", es: "Códigos de activación para PC y consola", fr: "Codes d'activation pour PC et console" },
    "cat.subscriptions": { pt: "Subscrições", en: "Subscriptions", es: "Suscripciones", fr: "Abonnements" },
    "cat.subscriptions.desc": { pt: "Subscrições mensais de serviços gaming", en: "Monthly gaming service subscriptions", es: "Suscripciones mensuales de servicios gaming", fr: "Abonnements mensuels de services gaming" },
    "cat.coaching": { pt: "Coaching", en: "Coaching", es: "Coaching", fr: "Coaching" },
    "cat.coaching.desc": { pt: "Sessões de coaching 1-on-1 com profissionais", en: "1-on-1 coaching sessions with pros", es: "Sesiones de coaching 1-on-1 con profesionales", fr: "Sessions de coaching 1-on-1 avec des pros" },

    // ─── Pricing ───
    "pricing.title": {
        pt: "Preços simples e", en: "Simple, transparent", es: "Precios simples y", fr: "Des tarifs simples et",
    },
    "pricing.titleAccent": {
        pt: "transparentes", en: "pricing", es: "transparentes", fr: "transparents",
    },
    "pricing.subtitle": {
        pt: "Escolhe o plano ideal para as tuas necessidades gaming. Atualiza ou cancela a qualquer momento.",
        en: "Choose the plan that fits your gaming needs. Upgrade or cancel anytime.",
        es: "Elige el plan que se adapte a tus necesidades gaming. Actualiza o cancela en cualquier momento.",
        fr: "Choisissez le plan qui correspond à vos besoins gaming. Mettez à niveau ou annulez à tout moment.",
    },
    "pricing.month": {
        pt: "mês", en: "month", es: "mes", fr: "mois",
    },
    "pricing.mostPopular": {
        pt: "Mais Popular", en: "Most Popular", es: "Más Popular", fr: "Plus Populaire",
    },
    // Plan names
    "plan.starter": { pt: "Iniciante", en: "Starter", es: "Iniciante", fr: "Débutant" },
    "plan.starter.desc": { pt: "Perfeito para gamers casuais", en: "Perfect for casual gamers", es: "Perfecto para gamers casuales", fr: "Parfait pour les gamers occasionnels" },
    "plan.pro": { pt: "Pro", en: "Pro", es: "Pro", fr: "Pro" },
    "plan.pro.desc": { pt: "Para gamers sérios que querem mais", en: "For serious gamers who want more", es: "Para gamers serios que quieren más", fr: "Pour les gamers sérieux qui veulent plus" },
    "plan.elite": { pt: "Elite", en: "Elite", es: "Elite", fr: "Élite" },
    "plan.elite.desc": { pt: "A experiência gaming definitiva", en: "The ultimate gaming experience", es: "La experiencia gaming definitiva", fr: "L'expérience gaming ultime" },
    // Features
    "feat.basicProducts": { pt: "Acesso a produtos básicos", en: "Access to basic products", es: "Acceso a productos básicos", fr: "Accès aux produits de base" },
    "feat.discord": { pt: "Acesso ao Discord comunitário", en: "Community Discord access", es: "Acceso al Discord comunitario", fr: "Accès au Discord communautaire" },
    "feat.emailSupport": { pt: "Suporte por email", en: "Email support", es: "Soporte por email", fr: "Support par email" },
    "feat.1sub": { pt: "1 subscrição ativa", en: "1 active subscription", es: "1 suscripción activa", fr: "1 abonnement actif" },
    "feat.everythingStarter": { pt: "Tudo do Iniciante", en: "Everything in Starter", es: "Todo del Iniciante", fr: "Tout du Débutant" },
    "feat.premiumAccess": { pt: "Acesso a produtos premium", en: "Premium product access", es: "Acceso a productos premium", fr: "Accès aux produits premium" },
    "feat.prioritySupport": { pt: "Suporte prioritário", en: "Priority support", es: "Soporte prioritario", fr: "Support prioritaire" },
    "feat.5subs": { pt: "5 subscrições ativas", en: "5 active subscriptions", es: "5 suscripciones activas", fr: "5 abonnements actifs" },
    "feat.exclusiveDeals": { pt: "Ofertas e descontos exclusivos", en: "Exclusive deals & discounts", es: "Ofertas y descuentos exclusivos", fr: "Offres et réductions exclusives" },
    "feat.earlyAccess": { pt: "Acesso antecipado a novos produtos", en: "Early access to new products", es: "Acceso anticipado a nuevos productos", fr: "Accès anticipé aux nouveaux produits" },
    "feat.everythingPro": { pt: "Tudo do Pro", en: "Everything in Pro", es: "Todo del Pro", fr: "Tout du Pro" },
    "feat.unlimitedSubs": { pt: "Subscrições ilimitadas", en: "Unlimited subscriptions", es: "Suscripciones ilimitadas", fr: "Abonnements illimités" },
    "feat.coaching": { pt: "Sessões de coaching 1-on-1", en: "1-on-1 coaching sessions", es: "Sesiones de coaching 1-on-1", fr: "Sessions de coaching 1-on-1" },
    "feat.customRequests": { pt: "Pedidos personalizados", en: "Custom requests", es: "Solicitudes personalizadas", fr: "Demandes personnalisées" },
    "feat.accountManager": { pt: "Gestor de conta dedicado", en: "Dedicated account manager", es: "Gestor de cuenta dedicado", fr: "Gestionnaire de compte dédié" },
    "feat.warranty": { pt: "Garantia vitalícia nas compras", en: "Lifetime warranty on purchases", es: "Garantía vitalicia en compras", fr: "Garantie à vie sur les achats" },

    // ─── Features / Why Vinhas ───
    "features.title": {
        pt: "Porquê escolher a", en: "Why choose", es: "Por qué elegir", fr: "Pourquoi choisir",
    },
    "features.subtitle": {
        pt: "Feito para gamers, por gamers. Cada detalhe é pensado para a melhor experiência.",
        en: "Built for gamers, by gamers. Every detail is designed for the best experience.",
        es: "Hecho para gamers, por gamers. Cada detalle está diseñado para la mejor experiencia.",
        fr: "Conçu pour les gamers, par les gamers. Chaque détail est pensé pour la meilleure expérience.",
    },
    "feat.securePayments": { pt: "Pagamentos Seguros", en: "Secure Payments", es: "Pagos Seguros", fr: "Paiements Sécurisés" },
    "feat.securePayments.desc": { pt: "Todas as transações são processadas pelo Stripe com encriptação ponta-a-ponta e proteção contra fraude.", en: "All transactions are processed through Stripe with end-to-end encryption and fraud protection.", es: "Todas las transacciones se procesan a través de Stripe con encriptación de extremo a extremo y protección contra fraude.", fr: "Toutes les transactions sont traitées via Stripe avec chiffrement de bout en bout et protection contre la fraude." },
    "feat.instantDelivery": { pt: "Entrega Instantânea", en: "Instant Delivery", es: "Entrega Instantánea", fr: "Livraison Instantanée" },
    "feat.instantDelivery.desc": { pt: "Produtos digitais entregues na tua conta instantaneamente após a compra. Sem esperas.", en: "Digital products delivered to your account instantly after purchase. No waiting, no delays.", es: "Productos digitales entregados en tu cuenta instantáneamente después de la compra.", fr: "Produits numériques livrés sur votre compte instantanément après l'achat." },
    "feat.flexibleSubs": { pt: "Garantia de Qualidade", en: "Quality Guarantee", es: "Garantía de Calidad", fr: "Garantie de Qualité" },
    "feat.flexibleSubs.desc": { pt: "Todos os nossos produtos são testados e verificados para garantir que recebes o que pagas. Sem surpresas.", en: "All our products are tested and verified to ensure you get what you pay for. No surprises, just quality.", es: "Todos nuestros productos son probados y verificados para garantizar que recibes lo que pagas.", fr: "Tous nos produits sont testés et vérifiés pour garantir que vous recevez ce que vous payez." },
    "feat.support247": { pt: "Suporte 24/7", en: "24/7 Support", es: "Soporte 24/7", fr: "Support 24/7" },
    "feat.support247.desc": { pt: "Obtém ajuda a qualquer momento através de chat ao vivo, Discord ou email.", en: "Get help anytime through live chat, Discord, or email. Our team is always ready.", es: "Obtén ayuda en cualquier momento a través de chat en vivo, Discord o email.", fr: "Obtenez de l'aide à tout moment via le chat en direct, Discord ou email." },

    // ─── FAQ ───
    "faq.title": {
        pt: "Perguntas", en: "Frequently asked", es: "Preguntas", fr: "Questions",
    },
    "faq.titleAccent": {
        pt: "frequentes", en: "questions", es: "frecuentes", fr: "fréquentes",
    },
    "faq.subtitle": {
        pt: "Tudo o que precisas saber sobre a Vinhas.gg.", en: "Everything you need to know about Vinhas.gg.", es: "Todo lo que necesitas saber sobre Vinhas.gg.", fr: "Tout ce que vous devez savoir sur Vinhas.gg.",
    },
    "faq.q1": { pt: "O que é a Vinhas.gg?", en: "What is Vinhas.gg?", es: "¿Qué es Vinhas.gg?", fr: "Qu'est-ce que Vinhas.gg ?" },
    "faq.a1": { pt: "A Vinhas.gg é uma plataforma premium de gaming digital onde podes comprar subscrições, produtos de jogo, serviços de boost e mais. Oferecemos transações seguras pelo Stripe e entrega instantânea.", en: "Vinhas.gg is a premium digital gaming platform where you can purchase subscriptions, game products, boosting services, and more. We offer secure transactions through Stripe and instant delivery for all digital products.", es: "Vinhas.gg es una plataforma premium de gaming digital donde puedes comprar suscripciones, productos de juego, servicios de boost y más.", fr: "Vinhas.gg est une plateforme premium de gaming numérique où vous pouvez acheter des abonnements, des produits de jeu, des services de boost et plus encore." },
    "faq.q2": { pt: "Como funcionam as compras?", en: "How do purchases work?", es: "¿Cómo funcionan las compras?", fr: "Comment fonctionnent les achats ?" },
    "faq.a2": { pt: "Basta escolheres o produto, finalizar o pagamento via Stripe e receberás o código ou acesso instantaneamente no teu painel. Simples e rápido.", en: "Simply choose the product, complete the payment via Stripe, and you'll receive the code or access instantly in your dashboard. Simple and fast.", es: "Simplemente elige el producto, completa el pago a través de Stripe y recibirás o el código o el acceso al instante.", fr: "Choisissez simplement le produit, validez le paiement via Stripe et vous recevrez le code ou l'accès instantanément." },
    "faq.q3": { pt: "É seguro comprar aqui?", en: "Is it safe to buy here?", es: "¿Es seguro comprar aquí?", fr: "Est-ce sûr d'acheter ici ?" },
    "faq.a3": { pt: "Absolutamente. Todos os pagamentos são processados pelo Stripe, com segurança e encriptação de nível bancário. Nunca armazenamos os teus dados de pagamento.", en: "Absolutely. All payments are processed through Stripe, which provides bank-level security and encryption. We never store your payment details directly.", es: "Absolutamente. Todos los pagos se procesan a través de Stripe con seguridad y encriptación de nivel bancário.", fr: "Absolument. Tous les paiements sont traités via Stripe avec une sécurité et un chiffrement de niveau bancaire." },
    "faq.q4": { pt: "Qual a velocidade da entrega?", en: "How fast is delivery?", es: "¿Qué tan rápida es la entrega?", fr: "Quelle est la rapidité de livraison ?" },
    "faq.a4": { pt: "Produtos digitais são entregues instantaneamente após a confirmação do pagamento. Recebes tudo diretamente no teu painel. Para serviços como boost ou coaching, os tempos são indicados em cada produto.", en: "Digital products are delivered instantly after payment confirmation. You'll receive your products directly in your dashboard. For services like boosting or coaching, delivery times are specified on each product page.", es: "Los productos digitales se entregan instantáneamente después de la confirmación del pago.", fr: "Les produits numériques sont livrés instantanément après confirmation du paiement." },
    "faq.q5": { pt: "Posso obter reembolso?", en: "Can I get a refund?", es: "¿Puedo obtener un reembolso?", fr: "Puis-je obtenir un remboursement ?" },
    "faq.a5": { pt: "Oferecemos reembolsos caso a caso. Se tiveres algum problema com a tua compra, contacta o suporte nas primeiras 24 horas.", en: "We offer refunds on a case-by-case basis. If you experience any issues with your purchase, contact our support team within 24 hours.", es: "Ofrecemos reembolsos caso por caso. Si tienes algún problema con tu compra, contacta al soporte dentro de las primeras 24 horas.", fr: "Nous offrons des remboursements au cas par cas. Si vous rencontrez des problèmes avec votre achat, contactez notre support dans les 24 heures." },
    "faq.q6": { pt: "Como contacto o suporte?", en: "How do I contact support?", es: "¿Cómo contacto al soporte?", fr: "Comment contacter le support ?" },
    "faq.a6": { pt: "Podes contactar-nos pelo Discord para suporte em tempo real, enviar email para support@vinhas.gg ou usar o chat ao vivo no site. A equipa está disponível 24/7.", en: "You can reach us through our Discord server for real-time support, send an email to support@vinhas.gg, or use the live chat feature on our website. Our team is available 24/7.", es: "Puedes contactarnos a través de Discord para soporte en tiempo real, enviar un email a support@vinhas.gg o usar el chat en vivo.", fr: "Vous pouvez nous contacter via Discord pour un support en temps réel, envoyer un email à support@vinhas.gg ou utiliser le chat en direct." },

    // ─── Footer ───
    "footer.desc": {
        pt: "Produtos e subscrições gaming digitais premium.", en: "Premium digital gaming products and subscriptions.", es: "Productos y suscripciones gaming digitales premium.", fr: "Produits et abonnements gaming numériques premium.",
    },
    "footer.product": { pt: "Produto", en: "Product", es: "Producto", fr: "Produit" },
    "footer.browseProducts": { pt: "Ver Produtos", en: "Browse Products", es: "Ver Productos", fr: "Voir Produits" },
    "footer.company": { pt: "Empresa", en: "Company", es: "Empresa", fr: "Entreprise" },
    "footer.about": { pt: "Sobre", en: "About", es: "Sobre", fr: "À propos" },
    "footer.blog": { pt: "Blog", en: "Blog", es: "Blog", fr: "Blog" },
    "footer.careers": { pt: "Carreiras", en: "Careers", es: "Carreras", fr: "Carrières" },
    "footer.support": { pt: "Suporte", en: "Support", es: "Soporte", fr: "Support" },
    "footer.helpCenter": { pt: "Centro de Ajuda", en: "Help Center", es: "Centro de Ayuda", fr: "Centre d'Aide" },
    "footer.contact": { pt: "Contacto", en: "Contact", es: "Contacto", fr: "Contact" },
    "footer.legal": { pt: "Legal", en: "Legal", es: "Legal", fr: "Légal" },
    "footer.terms": { pt: "Termos de Serviço", en: "Terms of Service", es: "Términos de Servicio", fr: "Conditions d'Utilisation" },
    "footer.privacy": { pt: "Política de Privacidade", en: "Privacy Policy", es: "Política de Privacidad", fr: "Politique de Confidentialité" },
    "footer.refund": { pt: "Política de Reembolso", en: "Refund Policy", es: "Política de Reembolso", fr: "Politique de Remboursement" },
    "footer.rights": { pt: "Todos os direitos reservados.", en: "All rights reserved.", es: "Todos los derechos reservados.", fr: "Tous droits réservés." },

    // ─── Auth ───
    "auth.welcomeBack": { pt: "Bem-vindo de volta", en: "Welcome back", es: "Bienvenido de nuevo", fr: "Bon retour" },
    "auth.createAccount": { pt: "Criar conta", en: "Create account", es: "Crear cuenta", fr: "Créer un compte" },
    "auth.signInDesc": { pt: "Entra na tua conta", en: "Sign in to your account", es: "Inicia sesión en tu cuenta", fr: "Connectez-vous à votre compte" },
    "auth.getStartedDesc": { pt: "Começa com a Vinhas.gg", en: "Get started with Vinhas.gg", es: "Empieza con Vinhas.gg", fr: "Commencez avec Vinhas.gg" },
    "auth.or": { pt: "ou", en: "or", es: "o", fr: "ou" },
    "auth.username": { pt: "Nome de utilizador", en: "Username", es: "Nombre de usuario", fr: "Nom d'utilisateur" },
    "auth.email": { pt: "Email", en: "Email", es: "Email", fr: "Email" },
    "auth.password": { pt: "Palavra-passe", en: "Password", es: "Contraseña", fr: "Mot de passe" },
    "auth.signIn": { pt: "Entrar", en: "Sign in", es: "Iniciar sesión", fr: "Se connecter" },
    "auth.noAccount": { pt: "Não tens conta?", en: "No account?", es: "¿No tienes cuenta?", fr: "Pas de compte ?" },
    "auth.hasAccount": { pt: "Já tens conta?", en: "Already have an account?", es: "¿Ya tienes cuenta?", fr: "Déjà un compte ?" },
    "auth.signUp": { pt: "Registar", en: "Sign up", es: "Registrarse", fr: "S'inscrire" },

    // ─── Products Page ───
    "products.title": { pt: "Produtos", en: "Products", es: "Productos", fr: "Produits" },
    "products.subtitle": { pt: "Explora todos os produtos e subscrições disponíveis.", en: "Browse all available products and subscriptions.", es: "Explora todos los productos y suscripciones disponibles.", fr: "Parcourez tous les produits et abonnements disponibles." },
    "products.search": { pt: "Procurar produtos...", en: "Search products...", es: "Buscar productos...", fr: "Rechercher des produits..." },
    "products.all": { pt: "Todos", en: "All", es: "Todos", fr: "Tous" },
    "products.found": { pt: "produto(s) encontrado(s)", en: "product(s) found", es: "producto(s) encontrado(s)", fr: "produit(s) trouvé(s)" },
    "products.subscribe": { pt: "Subscrever", en: "Subscribe", es: "Suscribir", fr: "S'abonner" },
    "products.buyNow": { pt: "Comprar", en: "Buy Now", es: "Comprar", fr: "Acheter" },

    // ─── Checkout ───
    "checkout.success": { pt: "Pagamento Concluído!", en: "Payment Successful!", es: "¡Pago Exitoso!", fr: "Paiement Réussi !" },
    "checkout.successDesc": { pt: "Obrigado pela tua compra. O teu produto foi entregue na tua conta. Verifica o teu painel para detalhes.", en: "Thank you for your purchase. Your product has been delivered to your account. Check your dashboard for details.", es: "Gracias por tu compra. Tu producto ha sido entregado en tu cuenta.", fr: "Merci pour votre achat. Votre produit a été livré sur votre compte." },
    "checkout.goDashboard": { pt: "Ir para o Painel", en: "Go to Dashboard", es: "Ir al Panel", fr: "Aller au Tableau de Bord" },
    "checkout.browseMore": { pt: "Ver Mais", en: "Browse More", es: "Ver Más", fr: "Voir Plus" },

    // ─── Dashboard ───
    "dashboard.myAccount": { pt: "Minha Conta", en: "My Account", es: "Mi Cuenta", fr: "Mon Compte" },
    "dashboard.purchases": { pt: "Compras", en: "Purchases", es: "Compras", fr: "Achats" },
    "dashboard.settings": { pt: "Definições", en: "Settings", es: "Configuración", fr: "Paramètres" },
    "dashboard.myPurchases": { pt: "As Minhas Compras", en: "My Purchases", es: "Mis Compras", fr: "Mes Achats" },
    "dashboard.myPurchasesDesc": { pt: "Vê as tuas encomendas e gere subscrições ativas.", en: "View your orders and manage active subscriptions.", es: "Ve tus pedidos y gestiona suscripciones activas.", fr: "Consultez vos commandes et gérez vos abonnements actifs." },
    "dashboard.totalSpent": { pt: "Total Gasto", en: "Total Spent", es: "Total Gastado", fr: "Total Dépensé" },
    "dashboard.activeSubs": { pt: "Subs Ativas", en: "Active Subs", es: "Subs Activas", fr: "Abonnements Actifs" },
    "dashboard.totalOrders": { pt: "Total Encomendas", en: "Total Orders", es: "Total Pedidos", fr: "Total Commandes" },
    "dashboard.orderHistory": { pt: "Histórico de Encomendas", en: "Order History", es: "Historial de Pedidos", fr: "Historique des Commandes" },
    "dashboard.cancel": { pt: "Cancelar", en: "Cancel", es: "Cancelar", fr: "Annuler" },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, locale: Locale): string {
    const entry = translations[key];
    if (!entry) return key;
    return entry[locale] || entry["en"] || key;
}

export default translations;
