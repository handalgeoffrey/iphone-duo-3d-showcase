import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Menu, X } from 'lucide-react';
import { sounds } from './AudioHaptics';

interface NavigationProps {
  onOpenViewer: () => void;
  onOpenSpecs: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  activeChapterId?: string;
  exploreBtnRef?: React.RefObject<HTMLButtonElement | null>;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenViewer,
  onOpenSpecs,
  reducedMotion,
  onToggleReducedMotion,
  activeChapterId = 'hero',
  exploreBtnRef
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll bleed when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleSoundToggle = () => {
    const active = sounds.toggle();
    setSoundActive(active);
  };

  const navLinks = [
    { label: 'Overview', href: '#hero', id: 'hero' },
    { label: 'Unfold', href: '#unfold', id: 'unfold' },
    { label: 'Design', href: '#design', id: 'design' },
    { label: 'Displays', href: '#displays', id: 'displays' },
    { label: 'Camera', href: '#camera', id: 'camera' },
    { label: 'Performance', href: '#performance', id: 'performance' },
    { label: 'Battery', href: '#battery', id: 'battery' },
    { label: 'Finishes', href: '#finish-reveal', id: 'finish-reveal' },
    { label: 'Pre-Order', href: '#preorder', id: 'preorder' }
  ];

  const handleLinkClick = () => {
    sounds.playClick();
    setMobileMenuOpen(false);
  };

  return (
    <header className={`global-nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-wrapper">
        <a href="#hero" className="brand-badge" aria-label="iPhone Duo Home">
          <span className="brand-title">iPhone Duo</span>
          <span className="brand-dot" aria-hidden="true" />
        </a>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="desktop-nav">
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className={`nav-link ${activeChapterId === link.id ? 'active' : ''}`}
                  onClick={() => sounds.playClick()}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="nav-link nav-btn-link"
                onClick={() => {
                  sounds.playClick();
                  onOpenSpecs();
                }}
                aria-label="Open technical specifications"
              >
                Tech Specs
              </button>
            </li>
          </ul>
        </nav>

        {/* Quiet Nav Actions: Sound toggle + Explore in 3D */}
        <div className="nav-actions">
          <button
            type="button"
            className="btn-icon-quiet"
            onClick={handleSoundToggle}
            title={soundActive ? 'Mute Mechanical Feedback' : 'Enable Mechanical Feedback'}
            aria-label={soundActive ? 'Mute Mechanical Feedback' : 'Enable Mechanical Feedback'}
          >
            {soundActive ? <Volume2 size={15} aria-hidden="true" /> : <VolumeX size={15} aria-hidden="true" />}
          </button>

          <button
            ref={exploreBtnRef}
            type="button"
            className="btn-explore-quiet"
            onClick={() => {
              sounds.playClick();
              onOpenViewer();
            }}
            aria-label="Open 3D Model Explorer"
          >
            <Sparkles size={13} aria-hidden="true" />
            <span>Explore in 3D</span>
          </button>

          <a
            href="#preorder"
            className="btn-apple-primary nav-preorder-btn"
            onClick={() => sounds.playClick()}
            style={{ padding: '6px 14px', fontSize: '12px', textDecoration: 'none' }}
          >
            Pre-Order
          </a>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer" role="dialog" aria-modal="true">
          <ul className="mobile-nav-links">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className={`mobile-nav-link ${activeChapterId === link.id ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="mobile-nav-link"
                style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer' }}
                onClick={() => {
                  handleLinkClick();
                  onOpenSpecs();
                }}
              >
                Tech Specs
              </button>
            </li>
            <li className="mobile-nav-explore-row">
              <button
                type="button"
                className="btn-apple-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  handleLinkClick();
                  onOpenViewer();
                }}
              >
                <Sparkles size={14} style={{ marginRight: 6 }} />
                Explore in 3D
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};
