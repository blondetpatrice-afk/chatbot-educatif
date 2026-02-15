// Backend API pour Groq - À déployer sur Vercel
// Ce fichier sera dans /api/chat.js

export default async function handler(req, res) {
  // Autoriser uniquement POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, courseContent, systemPrompt } = req.body;

    // Validation des données
    if (!message || !courseContent || !systemPrompt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Vérifier que la clé API existe
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Appel à l'API Groq
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Modèle Llama 3.3 (mis à jour)
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `${courseContent}\n\nQuestion de l'élève: ${message}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
        stream: false
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', groqResponse.status, errorText);
      
      // Gérer les erreurs spécifiques
      if (groqResponse.status === 429) {
        return res.status(429).json({ 
          error: 'Limite de requêtes atteinte. Veuillez réessayer dans quelques secondes.' 
        });
      }
      
      return res.status(groqResponse.status).json({ 
        error: `Erreur API Groq (${groqResponse.status})` 
      });
    }

    const data = await groqResponse.json();

    // Vérifier la réponse
    if (!data.choices || data.choices.length === 0) {
      console.error('No choices in Groq response:', data);
      return res.status(500).json({ error: 'Réponse invalide de l\'API' });
    }

    const responseText = data.choices[0].message.content;

    if (!responseText) {
      console.error('No content in response:', data);
      return res.status(500).json({ error: 'Pas de contenu dans la réponse' });
    }

    // Retourner la réponse
    return res.status(200).json({
      success: true,
      response: responseText,
      usage: data.usage // Pour monitoring (optionnel)
    });

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Erreur serveur: ' + error.message 
    });
  }
}
