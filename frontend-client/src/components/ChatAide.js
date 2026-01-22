import React, { useState } from 'react';
import './ChatAide.css';

const faq = [
  { q: "Quels produits proposez-vous ?", a: "Nous proposons des fruits, légumes, œufs, huile d'olive, produits laitiers et bien plus encore !" },
  { q: "Comment passer commande ?", a: "Ajoutez vos produits au panier puis validez votre commande depuis la page Panier." },
  { q: "Quels sont les moyens de paiement ?", a: "Vous pouvez payer en ligne (Stripe) ou à la livraison." },
  { q: "Livrez-vous partout ?", a: "Nous livrons dans la région indiquée lors de la commande. Contactez-nous pour plus d'infos !" },
];

function ChatAide() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Bonjour ! Je suis le chat d'aide ElBaraka Bio. Posez-moi une question ou choisissez une question fréquente ci-dessous." }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    // Réponse simple (FAQ)
    const found = faq.find(f => input.toLowerCase().includes(f.q.toLowerCase().split(' ')[0]));
    setTimeout(() => {
      setMessages(msgs => [...msgs, { from: 'bot', text: found ? found.a : "Merci pour votre question ! Nous vous répondrons très vite." }]);
    }, 600);
    setInput('');
  };

  return (
    <>
      <div className="chat-fab" onClick={() => setOpen(o => !o)}>
        <span role="img" aria-label="chat" style={{ fontSize: 28 }}>💬</span>
      </div>
      {open && (
        <div className="chat-box">
          <div className="chat-header">Aide ElBaraka Bio <button onClick={() => setOpen(false)} style={{ float: 'right', background: 'none', border: 'none', color: '#388E3C', fontSize: 18 }}>×</button></div>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={m.from === 'bot' ? 'chat-bot' : 'chat-user'}>{m.text}</div>
            ))}
          </div>
          <div className="chat-faq">
            {faq.map((f, i) => (
              <button key={i} className="chat-faq-btn" onClick={() => setInput(f.q)}>{f.q}</button>
            ))}
          </div>
          <div className="chat-input-row">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Votre question..." className="chat-input" />
            <button onClick={handleSend} className="btn">Envoyer</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatAide; 