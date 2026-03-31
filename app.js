/* =============================================
   SISTEMA DE GESTÃO PREMIUM - FIREBASE CLOUD CORE (v21)
   ============================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, 
  onAuthStateChanged, setPersistence, browserLocalPersistence, 
  browserSessionPersistence, signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, doc, setDoc, getDoc, getDocs, collection, 
  addDoc, updateDoc, deleteDoc, query, where, onSnapshot, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCIQodYJPfRIcPFQSkBgdqUI7Gmkkm4p4M",
  authDomain: "sistema-financias.firebaseapp.com",
  projectId: "sistema-financias",
  storageBucket: "sistema-financias.firebasestorage.app",
  messagingSenderId: "593841489895",
  appId: "1:593841489895:web:9bc5c6597a3865fc81df42"
};

const CONFIG = {
  ADMIN_EMAIL: 'jadson.nunes.150@gmail.com',
  WHATSAPP_NUMBER: '5579996069704',
  WHATSAPP_MESSAGE: 'Olá! Gostaria de ativar meu acesso ao sistema de gestão.',
  APP_NAME: 'GestãoPro'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

let currentUserData = null;

export const Theme = {
  init() {
    const saved = localStorage.getItem('theme') || 'light';
    this.set(saved);
  },
  set(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
      btn.innerHTML = `<i data-lucide="${theme === 'light' ? 'moon' : 'sun'}" size="20"></i>`;
      if (window.lucide) window.lucide.createIcons();
    }
  },
  toggle() {
    const current = localStorage.getItem('theme') || 'light';
    this.set(current === 'light' ? 'dark' : 'light');
  }
};

export const Auth = {
  async login(email, password, remember = false) {
    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'E-mail ou senha incorretos.' };
    }
  },
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        const userData = {
          id: user.uid, name: user.displayName || 'Usuário Google', email: user.email,
          role: user.email === CONFIG.ADMIN_EMAIL ? 'admin' : 'user',
          status: user.email === CONFIG.ADMIN_EMAIL ? 'active' : 'inactive',
          createdAt: serverTimestamp()
        };
        await setDoc(userDocRef, userData);
        currentUserData = userData;
      } else {
        currentUserData = userDoc.data();
      }
      return { success: true, user: user };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Erro ao entrar com Google.' };
    }
  },
  async register(name, email, password, securityQuestion, securityAnswer) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userData = {
        id: user.uid, name, email, securityQuestion,
        securityAnswer: securityAnswer.toLowerCase().trim(),
        role: email === CONFIG.ADMIN_EMAIL ? 'admin' : 'user',
        status: email === CONFIG.ADMIN_EMAIL ? 'active' : 'inactive',
        createdAt: serverTimestamp()
      };
      await setDoc(doc(db, "users", user.uid), userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Erro ao criar conta.' };
    }
  },
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'E-mail de recuperação enviado!' };
    } catch (error) {
      return { success: false, message: 'Erro ao enviar e-mail.' };
    }
  },
  async verifySecurityAnswer(email, answer) {
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return { success: false, message: 'Usuário não encontrado.' };
      const userData = snapshot.docs[0].data();
      if (userData.securityAnswer === answer.toLowerCase().trim()) return { success: true };
      return { success: false, message: 'Resposta incorreta.' };
    } catch (error) {
      return { success: false, message: 'Erro ao verificar resposta.' };
    }
  },
  logout() { signOut(auth).then(() => { window.location.href = 'index.html'; }); },
  async getCurrentUser() {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          currentUserData = userDoc.exists() ? userDoc.data() : null;
          resolve(currentUserData);
        } else {
          resolve(null);
        }
      });
    });
  },
  isActive() {
    return currentUserData && (currentUserData.status === 'active' || currentUserData.role === 'admin');
  }
};

export const DataHelper = {
  async getAll(col) {
    if (!auth.currentUser) return [];
    const q = query(collection(db, col), where("userId", "==", auth.currentUser.uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async add(col, item) {
    if (!Auth.isActive()) { showBlockedModal(); return { success: false }; }
    item.userId = auth.currentUser.uid;
    item.createdAt = serverTimestamp();
    const docRef = await addDoc(collection(db, col), item);
    return { success: true, id: docRef.id };
  },
  async update(col, id, updates) {
    if (!Auth.isActive()) { showBlockedModal(); return { success: false }; }
    await updateDoc(doc(db, col, id), { ...updates, updatedAt: serverTimestamp() });
    return { success: true };
  },
  async delete(col, id) {
    if (!Auth.isActive()) { showBlockedModal(); return { success: false }; }
    await deleteDoc(doc(db, col, id));
    return { success: true };
  },
  async sellProduct(productId, qty) {
    if (!Auth.isActive()) { showBlockedModal(); return { success: false }; }
    const docRef = doc(db, "products", productId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const p = snap.data();
      const currentQty = Number(p.quantity || 0);
      const sellQty = Number(qty);
      if (currentQty < sellQty) return { success: false, message: 'Estoque insuficiente!' };
      const totalSale = Number(p.price || 0) * sellQty;
      const profit = (Number(p.price || 0) - Number(p.cost || 0)) * sellQty;
      await updateDoc(docRef, { 
        quantity: currentQty - sellQty,
        soldCount: (p.soldCount || 0) + sellQty,
        totalProfit: (p.totalProfit || 0) + profit
      });
      await this.add("transactions", {
        description: `Venda: ${p.name} (x${sellQty})`,
        amount: totalSale, type: 'income', category: 'Vendas',
        date: new Date().toISOString().split('T')[0], profit
      });
      return { success: true };
    }
    return { success: false };
  }
};

export const Format = {
  currency(v) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0); },
  date(d) { 
    if (!d) return '-';
    const date = d.toDate ? d.toDate() : new Date(d);
    return date.toLocaleDateString('pt-BR');
  }
};

export function showToast(msg, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position:fixed; top:24px; right:24px; z-index:9999; display:flex; flex-direction:column; align-items:flex-end;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.style.cssText = `background:var(--bg-card); border:1px solid var(--border-color); color:var(--text-main); padding:16px 20px; border-radius:12px; font-size:14px; font-weight:600; box-shadow:var(--shadow-lg); margin-bottom:12px; border-left:4px solid var(--${type === 'success' ? 'success' : 'danger'}); animation: slideIn 0.3s ease-out;`;
  toast.innerHTML = msg;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 3000);
}

export function showBlockedModal() {
  if (document.getElementById('blockedModal')) return;
  const modal = document.createElement('div');
  modal.id = 'blockedModal';
  modal.className = 'modal-overlay';
  modal.style.zIndex = '10000';
  modal.innerHTML = `
    <div class="modal-content animate-in" style="max-width:400px; text-align:center; padding:40px;">
      <div style="width:80px; height:80px; background:rgba(239,68,68,0.1); color:var(--danger); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 24px;">
        <i data-lucide="lock" size="40"></i>
      </div>
      <h2 style="font-size:24px; font-weight:800; margin-bottom:12px;">Conta Inativa</h2>
      <p style="color:var(--text-muted); margin-bottom:32px;">Entre em contato via WhatsApp para liberar seu acesso.</p>
      <div style="display:grid; gap:12px;">
        <a href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(CONFIG.WHATSAPP_MESSAGE)}" target="_blank" class="btn btn-primary" style="text-decoration:none; justify-content:center;">
          <i data-lucide="message-circle"></i> Ativar via WhatsApp
        </a>
        <button class="btn btn-outline" onclick="location.reload()">Já fui ativado</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  if (window.lucide) window.lucide.createIcons();
}

window.Auth = Auth;
window.DataHelper = DataHelper;
window.Theme = Theme;
window.Format = Format;
window.showToast = showToast;
window.showBlockedModal = showBlockedModal;
