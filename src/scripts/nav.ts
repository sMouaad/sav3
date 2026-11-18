/**
 * Menu mobile. Le panneau s'appuie sur l'API Popover native (ouverture, Échap, clic extérieur).
 * Ce script ajoute seulement : fermeture après un clic sur un lien d'ancre de la même page,
 * fermeture au passage en affichage bureau, et un repli pour les navigateurs sans Popover.
 */
const menu = document.getElementById('site-menu');
const supportsPopover = typeof HTMLElement !== 'undefined' && 'popover' in HTMLElement.prototype;

if (menu) {
  const close = () => {
    if (supportsPopover) {
      if (menu.matches(':popover-open')) menu.hidePopover();
    } else {
      menu.classList.remove('is-open');
    }
  };

  menu.addEventListener('click', (event) => {
    if ((event.target as Element).closest('a')) close();
  });

  window.matchMedia('(min-width: 64em)').addEventListener('change', (event) => {
    if (event.matches) close();
  });

  if (!supportsPopover) {
    // Repli : bascule d'une classe et gestion d'Échap.
    menu.removeAttribute('popover');
    document.querySelectorAll<HTMLButtonElement>('[popovertarget="site-menu"]').forEach((button) => {
      button.addEventListener('click', () => {
        const hide = button.getAttribute('popovertargetaction') === 'hide';
        menu.classList.toggle('is-open', hide ? false : !menu.classList.contains('is-open'));
      });
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });
  }
}
