// Cloudflare Worker — AI Chatbot για klimis-giamouridis.gr
// Deployment: https://workers.cloudflare.com
// Secret: ANTHROPIC_API_KEY

const SYSTEM_PROMPT = `Είσαι ο AI βοηθός της ιστοσελίδας του ψυχολόγου Κλήμη Γιαμουρίδη στη Θεσσαλονίκη.

Πληροφορίες για τον Κλήμη Γιαμουρίδη:
- Τίτλος: Ειδικευμένος Γνωστικός Συμπεριφορικός Ψυχολόγος (MSc)
- Πιστοποίηση: EABCT (European Association for Behavioural and Cognitive Therapies)
- Διεύθυνση: Γρηγορίου Παλαμά 5 (κάθετος Τσιμισκή), Θεσσαλονίκη 54622
- Τηλέφωνο: +30 69 48 071 449
- Instagram: @klimisgiamouridis
- Facebook: facebook.com/k.giam

Υπηρεσίες:
1. Γνωστική Συμπεριφορική Θεραπεία (ΓΣΘ / CBT)
   - Για: γενικευμένο άγχος, κατάθλιψη, κρίσεις πανικού, κοινωνική αγχωτικότητα, φοβίες, χαμηλή αυτοεκτίμηση, PTSD
   - Διάρκεια: συνήθως 8-16 συνεδρίες
2. EMDR (Eye Movement Desensitization and Reprocessing)
   - Για: τραυματικές εμπειρίες, PTSD, παλιές τραυματικές αναμνήσεις
3. Ψυχομετρική Αξιολόγηση MMPI-2
   - Για: αξιολόγηση προσωπικότητας, κλινική εκτίμηση

Πώς γίνεται η πρώτη συνεδρία:
- Λήψη ιστορικού και κλινική εκτίμηση
- Συζήτηση στόχων
- Σχεδιασμός θεραπευτικού πλάνου
- Διάρκεια: ~50 λεπτά

Κανόνες ΑΥΣΤΗΡΑ:
- Απάντα ΠΑΝΤΑ στα ελληνικά
- Τόνος: ζεστός, ενσυναίσθητος, επαγγελματικός
- ΜΗΝ δίνεις ιατρικές διαγνώσεις ή φαρμακευτικές συμβουλές
- Για τιμές/κόστος: πες να καλέσουν στο +30 69 48 071 449 για πληροφορίες
- Για ραντεβού: κατεύθυνε ΠΑΝΤΑ στο τηλέφωνο +30 69 48 071 449
- ΜΗΝ αναφέρεις email
- Αν κάποιος αναφέρει κρίση, αυτοκτονικές σκέψεις ή άμεσο κίνδυνο: παρέπεμψε ΑΜΕΣΑ στο 10306 (γραμμή ψυχικής υγείας) ή 112
- Κράτα απαντήσεις σύντομες και κατανοητές (2-4 προτάσεις)
- Μη γνωστά θέματα: πες να επικοινωνήσουν τηλεφωνικά`;

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response('Bad request', { status: 400 });
    }

    const { message, history = [] } = body;
    if (!message || typeof message !== 'string') {
      return new Response('No message', { status: 400 });
    }

    const messages = [
      ...history.filter(m => m.role && m.content).slice(-8),
      { role: 'user', content: message.slice(0, 500) }
    ];

    let reply;
    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 350,
          system: SYSTEM_PROMPT,
          messages,
        }),
      });

      if (!resp.ok) throw new Error('API error ' + resp.status);
      const data = await resp.json();
      reply = data.content[0].text;
    } catch (e) {
      reply = 'Η υπηρεσία δεν είναι διαθέσιμη αυτή τη στιγμή. Παρακαλώ καλέστε στο +30 69 48 071 449.';
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  },
};
