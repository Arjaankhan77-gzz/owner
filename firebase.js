import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,signOut,createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {getFirestore,doc,getDoc,setDoc,deleteDoc,collection,getDocs} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Paste your Firebase web config here (Project settings > Your apps)
const cfg={apiKey:"AIzaSyCwDGJG6JCHpzFXXpOhie6HJFr37LrFAbg",authDomain:"owner-5cc98.firebaseapp.com",projectId:"owner-5cc98",storageBucket:"owner-5cc98.firebasestorage.app",messagingSenderId:"387082647367",appId:"1:387082647367:web:00d2063249bf03eb673e62"};
export const app=initializeApp(cfg);
export const auth=getAuth(app);
export const db=getFirestore(app);
export {signInWithEmailAndPassword,doc,getDoc,setDoc,deleteDoc,collection,getDocs,onAuthStateChanged,signOut};

export const toEmail=id=>id.includes("@")?id.trim():id.trim().toLowerCase()+"@center.app";

export async function roleOf(u){
  if((await getDoc(doc(db,"owners",u.uid))).exists())return "owner";
  if((await getDoc(doc(db,"students",u.uid))).data()?.active)return "student";
  return null;
}

// Page guard: only the needed role may stay
export function guard(need,cb){
  onAuthStateChanged(auth,async u=>{
    if(!u)return location.href="index.html";
    const r=await roleOf(u);
    if(r!==need){if(!r)await signOut(auth);return location.href="index.html";}
    cb(u);
  });
}

export const logout=()=>signOut(auth).then(()=>location.href="index.html");

// Create student login without logging the owner out
export async function createAuthUser(email,pass){
  const a2=getAuth(initializeApp(cfg,"second"+Date.now()));
  const c=await createUserWithEmailAndPassword(a2,email,pass);
  await signOut(a2);
  return c.user.uid;
}
