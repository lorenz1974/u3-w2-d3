import { Component } from 'react'
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Container,
  NavItem,
  NavLink,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Logo from '../assets/netflix_logo.png'
import Avatar from '../assets/avatar.png'

const MyNav = () => {
  const location = useLocation()

  const generateNavLink = (link, text) => {
    return (
      <Link
        to={link}
        className={location.pathname === link ? 'nav-link active' : 'nav-link'}
      >
        <div>{text}</div>
      </Link>
    )
  }
  return (
    <Navbar bg='dark' variant='dark' expand='lg'>
      <Container fluid>
        {/* Logo and Toggler Button */}
        <Navbar.Brand>
          <Link to='/'>
            <img width='100px' src={Logo} alt='Logo' />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle className='align-self-start' aria-controls='navbarNav' />

        {/* Search and User Section */}
        <div className='d-flex flex-grow-1 order-lg-2 justify-content-end'>
          <Form className='d-none my-auto' id='searchForm'>
            <FormControl type='text' placeholder='Search' className='m-0 p-0' />
          </Form>
          <p id='searchMagnifier' className='my-auto'>
            <i className='fa-solid fa-magnifying-glass ms-3'></i>
          </p>
          <p className='ms-3 my-auto fs-7'>KIDS</p>
          <p className='my-auto'>
            <i className='fa-solid fa-bell ms-3'></i>
          </p>
          <NavDropdown
            align='end'
            title={
              <img
                width='30px'
                src={Avatar}
                alt='User'
                className='dropdown-toggle'
              />
            }
            id='profileDropDown'
          >
            <NavDropdown.Item className='fs-7' href='/profile.html'>
              Profile
            </NavDropdown.Item>
            <NavDropdown.Item className='fs-7' href='/settings.html'>
              Settings
            </NavDropdown.Item>
          </NavDropdown>
        </div>

        {/* Navbar Items */}
        <Navbar.Collapse id='navbarNav'>
          <Nav className='me-auto'>
            <Nav.Item className='fs-7'>{generateNavLink('/', 'Home')}</Nav.Item>
            <Nav.Item className='fs-7'>
              {generateNavLink('/tv-show', 'TV Shows')}
            </Nav.Item>
            <Nav.Item className='fs-7'>
              {generateNavLink('/movies', 'Movies')}
            </Nav.Item>
            <Nav.Item className='fs-7'>
              {generateNavLink('/new-and-popular', 'New & Popular')}
            </Nav.Item>
            <Nav.Item className='fs-7'>
              {generateNavLink('/my-list', 'My List')}
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default MyNav
