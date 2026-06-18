/* LifeOS – Data Layer */
const DB = {
  get(k,def=null){ try{ const v=localStorage.getItem('lifeos_'+k); return v?JSON.parse(v):def; }catch(e){ return def; } },
  set(k,v){ try{ localStorage.setItem('lifeos_'+k,JSON.stringify(v)); }catch(e){} },
  del(k){ localStorage.removeItem('lifeos_'+k); }
};
const quotes=[
  {text:"The secret of getting ahead is getting started.",author:"Mark Twain"},
  {text:"It always seems impossible until it's done.",author:"Nelson Mandela"},
  {text:"Don't watch the clock; do what it does. Keep going.",author:"Sam Levenson"},
  {text:"The future depends on what you do today.",author:"Mahatma Gandhi"},
  {text:"Small steps every day lead to big results.",author:"LifeOS"},
  {text:"Focus on progress, not perfection.",author:"LifeOS"},
  {text:"Your only limit is your mind.",author:"Unknown"},
  {text:"Consistency is the mother of mastery.",author:"Robin Sharma"},
  {text:"You don't have to be great to start, but you have to start to be great.",author:"Zig Ziglar"},
  {text:"Push yourself, because no one else is going to do it for you.",author:"Unknown"},
  {text:"Great things never came from comfort zones.",author:"Unknown"},
  {text:"Dream it. Believe it. Build it.",author:"LifeOS"},
  {text:"Every day is a new beginning.",author:"Unknown"},
  {text:"Success is the sum of small efforts repeated day in and day out.",author:"Robert Collier"},
  {text:"You are capable of amazing things.",author:"LifeOS"},
  {text:"Make each day your masterpiece.",author:"John Wooden"},
  {text:"The only way to do great work is to love what you do.",author:"Steve Jobs"},
  {text:"Believe you can and you are halfway there.",author:"Theodore Roosevelt"},
  {text:"Act as if what you do makes a difference. It does.",author:"William James"},
  {text:"Start where you are. Use what you have. Do what you can.",author:"Arthur Ashe"}
];
const moodEmojis={happy:'😊',focused:'🎯',productive:'⚡',relaxed:'😌',busy:'🌪️',tired:'😴'};
const memoryEmojis=['🏆','⭐','🎯','🚀','💡','🎉','🌟','💪','🔥','✨','🎓','❤️','🌈','🎊','🏅'];
