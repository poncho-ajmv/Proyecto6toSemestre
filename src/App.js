import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { View, StyleSheet } from 'react-native';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Welcome from './pages/Welcome';
import PetList from './pages/PetList';
import Reminders from './pages/Reminders';
import Tasks from './pages/Tasks';
import Tips from './pages/Tips';
import PetDetails from './pages/PetDetails';
import Contact from './pages/Contact';
import Movies from './pages/Movies';
import VerData from './pages/VerData';
import UpdateUser from './pages/UpdateUser';
import AgregarMascota from './pages/AgregarMascota';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PetProvider } from './context/PetContext';
import { BestGuessProvider } from './context/BestGuessContext';
import ChatIcon from './components/ChatIcon';
import Metas from './pages/Metas';
import IA from './pages/IA';
import Galeria from './pages/Galeria';
import SeeProfile from './pages/SeeProfile';
import Mapa from './pages/Mapa';
import EditarMascota from './pages/EditarMascota';
import ChatBot from './pages/ChatBot';
import AdminProfiles from './pages/AdminProfiles'; // Importa el componente nuevo

import DataBase from './pages/DataBase';

// Ruta privada que verifica autenticación
const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/" />;
};

// Ruta privada solo para root
const RootOnlyRoute = ({ children }) => {
    const { user } = useAuth();
    return user?.email === 'root@root.com' ? children : <Navigate to="/" />;
};

const App = () => {
    const location = useLocation();
    const hideHeaderRoutes = ['/', '/register'];
    const hideChatRoutes = ['/', '/register'];

    return (
        <View style={styles.appContainer}>
            {!hideHeaderRoutes.includes(location.pathname) && <Header />}
            <View style={styles.contentContainer}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/welcome" element={<PrivateRoute><Welcome /></PrivateRoute>} />
                    <Route path="/petlist" element={<PrivateRoute><PetList /></PrivateRoute>} />
                    <Route path="/reminders" element={<PrivateRoute><Reminders /></PrivateRoute>} />
                    <Route path="/SeeProfile" element={<PrivateRoute><SeeProfile /></PrivateRoute>} />
                    <Route path="/Mapa" element={<PrivateRoute><Mapa/></PrivateRoute>} />
                    <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
                    <Route path="/tips" element={<PrivateRoute><Tips /></PrivateRoute>} />
                    <Route path="/update-user" element={<PrivateRoute><UpdateUser /></PrivateRoute>} />
                    <Route path="/verdata" element={<PrivateRoute><VerData /></PrivateRoute>} />
                    <Route path="/pets/:id" element={<PrivateRoute><PetDetails /></PrivateRoute>} />
                    <Route path="/contact" element={<PrivateRoute><Contact /></PrivateRoute>} />
                    <Route path="/movies" element={<PrivateRoute><Movies /></PrivateRoute>} />
                    <Route path="/agregar-mascota" element={<PrivateRoute><AgregarMascota /></PrivateRoute>} /> 
                    <Route path="/metas" element={<PrivateRoute><Metas /></PrivateRoute>} />
                    <Route path="/ia" element={<PrivateRoute><IA /></PrivateRoute>} />
                    <Route path="/galeria" element={<PrivateRoute><Galeria /></PrivateRoute>} />
                    <Route path="/editar-mascota" element={<PrivateRoute><EditarMascota /></PrivateRoute>} />
                    <Route path="/database" element={<PrivateRoute><DataBase /></PrivateRoute>} />
                    <Route path="/chatbot" element={<PrivateRoute><ChatBot /></PrivateRoute>} />
                    ChatBot
                    
                    <Route path="/admin-profiles" element={<RootOnlyRoute><AdminProfiles /></RootOnlyRoute>} /> {/* Nueva ruta exclusiva para root */}
                </Routes>
            </View>
            <Footer />
            {!hideChatRoutes.includes(location.pathname) && <ChatIcon />}
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    linkContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#080710',
        fontSize: 18,
        fontWeight: '600',
    },
});

const WrappedApp = () => (
    <AuthProvider>
        <PetProvider>
            <BestGuessProvider>
                <Router>
                    <App />
                </Router>
            </BestGuessProvider>
        </PetProvider>
    </AuthProvider>
);

export default WrappedApp;
