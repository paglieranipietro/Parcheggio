// Dati simulati per il login
const USERS = [
  {
    id: 1,
    email: "admin@brescia.it",
    password: "password123",
    role: "admin",
    name: "Responsabile Brescia",
  },
  {
    id: 2,
    email: "studente@gmail.com",
    password: "user2026",
    role: "user",
    name: "Mario Rossi",
  },
];

// Funzione che simula una chiamata API (ritorna una Promise)
export const loginRequest = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = USERS.find(
        (u) => u.email === email && u.password === password
      );
      if (user) {
        resolve({ status: 200, data: user });
      } else {
        reject({ status: 401, message: "Credenziali non valide" });
      }
    }, 800); // Simuliamo un po' di ritardo di rete
  });
};

// supporto semplificato per la registrazione (finto)
export const registerRequest = (name, email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existing = USERS.find((u) => u.email === email);
      if (existing) {
        reject({ status: 409, message: "Email già registrata" });
      } else {
        const newUser = {
          id: USERS.length + 1,
          name,
          email,
          password,
          role: "user",
        };
        USERS.push(newUser);
        resolve({ status: 201, data: newUser });
      }
    }, 800);
  });
};