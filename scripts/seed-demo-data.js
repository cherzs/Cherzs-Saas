const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const demoUsers = [
  {
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    password: "Demo123!",
    userType: "DEVELOPER",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "Mike Rodriguez", 
    email: "mike.rodriguez@example.com",
    password: "Demo123!",
    userType: "DEVELOPER",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "Emma Thompson",
    email: "emma.thompson@example.com", 
    password: "Demo123!",
    userType: "DEVELOPER",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "David Park",
    email: "david.park@example.com",
    password: "Demo123!",
    userType: "DEVELOPER",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "Lisa Wang",
    email: "lisa.wang@example.com",
    password: "Demo123!",
    userType: "REGULAR",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    password: "Demo123!",
    userType: "REGULAR", 
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
  }
];

const demoIdeas = [
  {
    title: "AI-Powered Customer Support Platform",
    description: "Revolutionize customer service with an intelligent platform that learns from every interaction. Our AI analyzes customer sentiment, provides instant responses, and escalates complex issues to human agents seamlessly. Features include multilingual support, integration with popular helpdesk tools, and advanced analytics to improve customer satisfaction rates by up to 40%.",
    screenshots: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
    ],
    authorEmail: "sarah.chen@example.com",
    views: 2847,
    likes: 234
  },
  {
    title: "Blockchain Healthcare Records",
    description: "Secure, decentralized platform for managing patient health records with complete privacy control and interoperability. Patients own their data, doctors get instant access to comprehensive medical histories, and insurance claims are processed automatically through smart contracts. HIPAA compliant with zero-knowledge proofs for sensitive data.",
    screenshots: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop"
    ],
    authorEmail: "mike.rodriguez@example.com", 
    views: 1923,
    likes: 187
  },
  {
    title: "No-Code API Builder",
    description: "Visual platform that empowers non-technical users to create, test, and deploy APIs without writing code. Drag-and-drop interface for database connections, authentication setup, and endpoint creation. Includes automatic documentation generation, rate limiting, and monitoring dashboards. Perfect for startups and enterprises looking to accelerate development.",
    screenshots: [
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=600&fit=crop"
    ],
    authorEmail: "emma.thompson@example.com",
    views: 3456,
    likes: 312
  },
  {
    title: "Smart Contract Auditing Tool",
    description: "Automated security analysis for smart contracts with AI-powered vulnerability detection. Scans for common exploits, gas optimization opportunities, and compliance issues. Provides detailed reports with fix suggestions and integrates with popular development frameworks. Used by 50+ DeFi projects to secure over $2B in assets.",
    screenshots: [
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop"
    ],
    authorEmail: "david.park@example.com",
    views: 1654,
    likes: 143
  },
  {
    title: "Sustainable Supply Chain Tracker",
    description: "End-to-end supply chain transparency platform using IoT sensors and blockchain technology. Track products from raw materials to end consumers, verify sustainability claims, and ensure ethical sourcing. Features carbon footprint calculations, supplier scorecards, and consumer-facing transparency reports. Helping brands build trust and meet ESG goals.",
    screenshots: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=600&fit=crop"
    ],
    authorEmail: "sarah.chen@example.com",
    views: 2134,
    likes: 198
  },
  {
    title: "Mental Health AI Companion",
    description: "Personalized mental health support through conversational AI trained on cognitive behavioral therapy techniques. Provides 24/7 emotional support, mood tracking, personalized coping strategies, and crisis intervention. Integrates with healthcare providers for seamless care coordination. Clinical trials show 60% improvement in user wellbeing scores.",
    screenshots: [
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop"
    ],
    authorEmail: "mike.rodriguez@example.com",
    views: 2876,
    likes: 267
  },
  {
    title: "Decentralized Learning Platform",
    description: "Peer-to-peer education marketplace where anyone can teach and learn skills using blockchain credentials. Smart contracts handle payments, certifications are NFT-based, and reputation systems ensure quality. Features include live classes, recorded content, skill assessments, and career pathway recommendations. Empowering the future of work through decentralized education.",
    screenshots: [
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
    ],
    authorEmail: "emma.thompson@example.com",
    views: 1987,
    likes: 156
  },
  {
    title: "Carbon Credit Marketplace",
    description: "Transparent marketplace for buying and selling verified carbon credits using blockchain technology. Real-time satellite monitoring of forest projects, automated verification through IoT sensors, and fractional ownership of environmental projects. Making carbon offsetting accessible to individuals and small businesses while ensuring genuine environmental impact.",
    screenshots: [
      "https://images.unsplash.com/photo-1569163139394-de44cb40ef4e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop"
    ],
    authorEmail: "david.park@example.com",
    views: 1456,
    likes: 134
  }
];

async function main() {
  console.log('🌱 Starting demo data seeding...');

  // Create demo users
  console.log('👥 Creating demo users...');
  const createdUsers = {};
  
  for (const userData of demoUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: userData.name,
        email: userData.email,
        hashedPassword,
        userType: userData.userType,
        image: userData.image,
      },
    });
    
    createdUsers[userData.email] = user;
    console.log(`✅ Created user: ${user.name} (${user.userType})`);
  }

  // Create demo ideas
  console.log('💡 Creating demo ideas...');
  const createdIdeas = [];
  
  for (const ideaData of demoIdeas) {
    const author = createdUsers[ideaData.authorEmail];
    
    const idea = await prisma.idea.create({
      data: {
        title: ideaData.title,
        description: ideaData.description,
        screenshots: ideaData.screenshots,
        views: ideaData.views,
        likes: ideaData.likes,
        authorId: author.id,
      },
    });
    
    createdIdeas.push(idea);
    console.log(`✅ Created idea: ${idea.title}`);
  }

  // Create some favorites (Regular users liking ideas)
  console.log('❤️ Creating favorites...');
  const regularUsers = Object.values(createdUsers).filter(user => user.userType === 'REGULAR');
  
  for (const user of regularUsers) {
    // Each regular user likes 2-4 random ideas
    const numFavorites = Math.floor(Math.random() * 3) + 2;
    const randomIdeas = createdIdeas.sort(() => 0.5 - Math.random()).slice(0, numFavorites);
    
    for (const idea of randomIdeas) {
      try {
        await prisma.favorite.create({
          data: {
            userId: user.id,
            ideaId: idea.id,
          },
        });
        console.log(`✅ ${user.name} favorited "${idea.title}"`);
      } catch (error) {
        // Skip if already exists
      }
    }
  }

  console.log('🎉 Demo data seeding completed!');
  console.log('\n📊 Summary:');
  console.log(`👥 Users created: ${Object.keys(createdUsers).length}`);
  console.log(`💡 Ideas created: ${createdIdeas.length}`);
  console.log(`❤️ Favorites created: Multiple interactions`);
  console.log('\n🔐 Demo login credentials:');
  console.log('Developer accounts:');
  demoUsers.filter(u => u.userType === 'DEVELOPER').forEach(u => {
    console.log(`  📧 ${u.email} / 🔑 ${u.password}`);
  });
  console.log('Regular user accounts:');
  demoUsers.filter(u => u.userType === 'REGULAR').forEach(u => {
    console.log(`  📧 ${u.email} / 🔑 ${u.password}`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error seeding demo data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 