import React, { useEffect, useState } from 'react';
import './navbar.scss'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import newRequest from '../../utils/newRequest';
const Navbar = () => {
    const [active, setactive] = useState(false);
    const [active1, setactive1] = useState(false);
    const [open, setopen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { pathname } = useLocation();
    const isActive = () => {
        window.scrollY > 0 ? setactive(true) : setactive(false);
    }
    const isActive1 = () => {
        window.scrollY > 50 ? setactive1(true) : setactive1(false);
    }
    useEffect(() => {
        window.addEventListener('scroll', isActive);
        window.addEventListener('scroll', isActive1);
        return () => {
            window.removeEventListener('scroll', isActive);
            window.removeEventListener('scroll', isActive1);
        }
    }, []);

    const current_user = JSON.parse(localStorage.getItem('currentUser'));
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await newRequest.post('/auth/logout');
            localStorage.setItem("currentUser", null);
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    }
    const [input, setinput] = useState("");
    const handlesubmit = () => {
        navigate(`gigs?search=${input}`);
    }

    const categories = [
        { label: "Graphics & Design", cat: "Graphics & Design" },
        { label: "Video & Animation", cat: "Video & Animation" },
        { label: "Writing & Translation", cat: "Writing & Translation" },
        { label: "AI Services", cat: "AI Services" },
        { label: "Digital Marketing", cat: "Digital Marketing" },
        { label: "Music & Audio", cat: "Music & Audio" },
        { label: "Programming & Tech", cat: "Programming & Tech" },
        { label: "Business", cat: "Business" },
        { label: "Lifestyle", cat: "Lifestyle" },
    ];

    return ([
        <div className={active || pathname !== "/" ? "navbar active" : "navbar "} key="navbar">
            <div className="container">
                <div className="logo">
                    <Link to='/' className='link'>
                        <span className='log'>fiverr</span>
                    </Link>
                    <span className='dot'>.</span>
                </div>
                {active && <div className="navbarsearch">
                    <input type="text" placeholder='what service are you looking for today?' onChange={e => setinput(e.target.value)} />
                    <div className="search">
                        <img src="/images/search.png" alt="search" onClick={handlesubmit} />
                    </div>
                </div>}
                <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                    <span></span><span></span><span></span>
                </button>
                <div className={`links${menuOpen ? " open" : ""}`}>
                    <span onClick={() => { navigate('/becomeseller'); setMenuOpen(false); }}>fiverr Business</span>
                    <span className="tooltip">Explore
                        <span className="tooltiptext">
                            <div className="col">
                                <div className="item_tooltip">
                                    <h4 className='item_tooltip_header'>Discover</h4>
                                    <p className='item_tooltip_desc'>Inspiring projects made on Fiverr</p>
                                </div>
                                <div className="item_tooltip">
                                    <h4 className='item_tooltip_header'>Guides</h4>
                                    <p className='item_tooltip_desc'>In-depth guides covering business topics</p>
                                </div>
                                <div className="item_tooltip">
                                    <h4 className='item_tooltip_header'>Podcast</h4>
                                    <p className='item_tooltip_desc'>Inside tips from top business minds</p>
                                </div>
                                <div className='item_tooltip'>
                                    <h4 className='item_tooltip_header'>Logo Maker</h4>
                                    <p className='item_tooltip_desc'>Create your logo instantly</p>
                                </div>
                            </div>
                            <div className="col">
                                <div className="item_tooltip">
                                    <h4 className='item_tooltip_header'>Community</h4>
                                    <p className='item_tooltip_desc'>Connect with Fiverr's team and community</p>
                                </div>
                                <div className="item_tooltip">
                                    <h4 className='item_tooltip_header'>Podcast</h4>
                                    <p className='item_tooltip_desc'>Inside tips from top business minds</p>
                                </div>
                                <div className="item_tooltip">
                                    <h4 className='item_tooltip_header'>Blog</h4>
                                    <p className='item_tooltip_desc'>News, information and community stories</p>
                                </div>
                                <div className="item_tooltip">
                                    <h4 className='item_tooltip_header'>Fiverr Workspace</h4>
                                    <p className='item_tooltip_desc'>One place to manage your business</p>
                                </div>
                            </div>
                        </span>
                    </span>
                    <span>
                        <img src='/images/language.png' alt='language' width={'18px'} height={'16px'} style={{ marginRight: '10px' }} />
                        English
                    </span>
                    {!current_user && <Link to='/login' className='link' key={333}><span>Sign in</span></Link>}
                    {!current_user?.isSeller && <span onClick={() => { navigate('/becomeSeller'); setMenuOpen(false); }}>Become a Seller</span>}
                    {!current_user && <button onClick={() => { navigate('/register'); setMenuOpen(false); }}>Join</button>}
                    {current_user && (
                        <div className="user" onClick={() => setopen(!open)}>
                            <img src={current_user.img || '/images/noavtar.jpeg'} alt="avatar" />
                            <span>{current_user?.username}</span>
                            {open && (
                                <div className="options">
                                    <Link className='link' to={`/profile/${current_user._id}`}>Profile</Link>
                                    {current_user.isSeller && (
                                        <>
                                            <Link className='link' to='/mygigs'>Gigs</Link>
                                            <Link className='link' to='/add'>Add New Gig</Link>
                                        </>
                                    )}
                                    {current_user.isAdmin && <Link className='link' to='/admin'>Admin Panel</Link>}
                                    <Link className='link' to='/orders'>Orders</Link>
                                    <Link className='link' to='/messages'>Messages</Link>
                                    <Link className='link' onClick={handleLogout}>Logout</Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {(active1 || pathname !== "/") && (
                <>
                    <hr />
                    <div className="menu">
                        {categories.map((c) => (
                            <Link key={c.cat} className='link menulink' to={`/gigs?cat=${encodeURIComponent(c.cat)}`}>
                                {c.label}
                            </Link>
                        ))}
                    </div>
                    <hr />
                </>
            )}
        </div>
    ]);
}
export default Navbar;
