import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Post from './pages/Post';
import AddPost from './pages/AddPost';
import EditPost from './pages/EditPost';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
          <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/add-post" element={<AddPost />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<Search />} />
        <Route path="/auth" element={<Auth />} />
      </Routes> 
    </Router>
  );
}

export default App;
