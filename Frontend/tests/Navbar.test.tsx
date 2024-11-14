import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../src/components/Navigation/Navbar';
import React from 'react';
import assert from 'assert';

// Wrapper to render with BrowserRouter since Navbar uses Links
const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('Navbar Component', () => {
  
    it('renders the Navbar component', () => {
        renderWithRouter(<Navbar />);
        
        // Check the main nav element and inner section
        const mainNav = screen.getByRole('navigation', { name: /navbar/i });
        assert(mainNav !== null, 'Main navigation element should be in the document');

        // Check if logo image is rendered correctly
        const logoImage = screen.getByAltText('');
        assert(logoImage !== null, 'Logo image should be in the document');
        assert.strictEqual(logoImage.getAttribute('src'), '/logo.webp', 'Logo should have the correct src attribute');

        // Check for "Musu kava" and "Kontaktai" links in navbar
        const coffeeLink = screen.getByRole('link', { name: /musu kava/i });
        const contactLink = screen.getByRole('link', { name: /kontaktai/i });

        assert(coffeeLink !== null, '"Musu kava" link should be in the document');
        assert(contactLink !== null, '"Kontaktai" link should be in the document');
        assert.strictEqual(coffeeLink.getAttribute('href'), '/produktai', 'Coffee link should have the correct href attribute');
        assert.strictEqual(contactLink.getAttribute('href'), '/kontaktai', 'Contact link should have the correct href attribute');
    });

    it('renders MenuButton on small screens', () => {
        renderWithRouter(<Navbar />);
        
        // Since MenuButton is inside a section for small screens, check its presence
        const menuButton = screen.getByRole('button', { name: /menu/i });
        assert(menuButton !== null, 'Menu button should be in the document on small screens');
    });

    it('renders CartButton, ThemeButton, and UserBubble on larger screens', () => {
        renderWithRouter(<Navbar />);
        
        // Check for CartButton presence
        const cartButton = screen.getByRole('button', { name: /cart/i });
        assert(cartButton !== null, 'Cart button should be in the document');
        
        // Check for ThemeButton presence
        const themeButton = screen.getByRole('button', { name: /theme/i });
        assert(themeButton !== null, 'Theme button should be in the document');

        // Check for UserBubble presence
        const userBubble = screen.getByRole('img', { name: /user bubble/i });
        assert(userBubble !== null, 'User bubble should be in the document');
    });

    it('ensures Navbar is styled correctly with gradient classes', () => {
        renderWithRouter(<Navbar />);

        // Verify gradient classes are present in the Navbar element
        const gradientNav = screen.getByRole('navigation', { name: /navbar/i });
        assert(gradientNav !== null, 'Navbar should have gradient styling');
        assert(gradientNav.classList.contains('bg-gradient-to-br'), 'Navbar should have bg-gradient-to-br class');
        assert(gradientNav.classList.contains('from-[#291E1E]'), 'Navbar should have from-[#291E1E] class');
        assert(gradientNav.classList.contains('to-[#5C4342]'), 'Navbar should have to-[#5C4342] class');
    });
});