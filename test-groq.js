// Test local de l'API Groq
// Utilisation : node test-groq.js

const GROQ_API_KEY = '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'; // Remplacez par votre vraie clé

async function testGroq() {
  console.log('🧪 Test de connexion à Groq...\n');

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant pédagogique.'
          },
          {
            role: 'user',
            content: 'Explique brièvement la photosynthèse.'
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur API:', response.status);
      console.error(errorText);
      return;
    }

    const data = await response.json();
    
    console.log('✅ Connexion réussie !\n');
    console.log('📝 Réponse de Groq:');
    console.log('─────────────────────────────────────');
    console.log(data.choices[0].message.content);
    console.log('─────────────────────────────────────\n');
    
    console.log('📊 Usage:');
    console.log(`   Tokens prompt: ${data.usage.prompt_tokens}`);
    console.log(`   Tokens completion: ${data.usage.completion_tokens}`);
    console.log(`   Total: ${data.usage.total_tokens}\n`);
    
    console.log('🎉 Tout fonctionne ! Vous pouvez déployer.');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Vérifier que la clé est configurée
if (GROQ_API_KEY === 'METTEZ_VOTRE_CLE_ICI') {
  console.error('❌ Veuillez remplacer GROQ_API_KEY par votre vraie clé dans ce fichier.');
  process.exit(1);
}

testGroq();
