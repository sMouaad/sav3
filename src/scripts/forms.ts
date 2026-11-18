/**
 * Amélioration progressive des formulaires Netlify Forms.
 * - Validation avec messages localisés (au lieu des bulles natives du navigateur).
 * - Formulaire en étapes (attribut data-step) avec barre de progression et gestion du focus.
 * - Envoi en arrière-plan (fetch) puis redirection vers la page de remerciement.
 * Sans JavaScript, le formulaire reste entièrement fonctionnel (validation native + envoi classique).
 */

type Messages = {
  required: string;
  choice: string;
  email: string;
  phone: string;
  consent: string;
  summary: string;
  submit: string;
  local: string;
  sending: string;
  stepOf: string;
};

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Aperçu hors Netlify (serveur local ou tunnel) : on valide, mais on n'envoie rien. */
const isLocalPreview =
  import.meta.env.DEV ||
  import.meta.env.PUBLIC_FORMS_PREVIEW === 'true' || // build d'aperçu hors Netlify (ex. VPS)
  location.protocol === 'file:' ||
  ['localhost', '127.0.0.1', '[::1]', '::1'].includes(location.hostname) ||
  /\.(trycloudflare\.com|ngrok-free\.app|ngrok\.app)$/.test(location.hostname);

function errorElementFor(el: Element): HTMLElement | null {
  const scope = el.closest('[data-choice-group], [data-field]');
  return scope?.querySelector<HTMLElement>(':scope > [data-error]') ?? null;
}

function setError(controls: Control[], message: string) {
  const errorEl = errorElementFor(controls[0]);
  for (const c of controls) {
    if (message) c.setAttribute('aria-invalid', 'true');
    else c.removeAttribute('aria-invalid');
  }
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.hidden = !message;
  }
}

function validateControl(el: Control, msg: Messages): string {
  if (el instanceof HTMLInputElement && el.type === 'checkbox') {
    return el.required && !el.checked ? msg.consent : '';
  }
  const value = el.value.trim();
  if (el.required && !value) return el instanceof HTMLSelectElement ? msg.choice : msg.required;
  if (!value) return '';
  if (el instanceof HTMLInputElement && el.type === 'email' && !EMAIL.test(value)) return msg.email;
  if (el instanceof HTMLInputElement && el.type === 'tel') {
    const digits = value.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) return msg.phone;
  }
  return '';
}

/** Valide tous les champs d'un conteneur ; renvoie le premier champ invalide. */
function validate(container: ParentNode, msg: Messages): Control | null {
  let first: Control | null = null;
  const groups = new Set<HTMLElement>();
  const controls = container.querySelectorAll<Control>('input:not([type="hidden"]), select, textarea');

  for (const el of controls) {
    if (!el.name || el.closest('.form__hp')) continue;
    const group = el.closest<HTMLElement>('[data-choice-group]');
    if (group) {
      groups.add(group);
      continue;
    }
    const message = validateControl(el, msg);
    setError([el], message);
    if (message && !first) first = el;
  }

  for (const group of groups) {
    const inputs = [...group.querySelectorAll<HTMLInputElement>('input')];
    const missing = group.dataset.required === 'true' && !inputs.some((i) => i.checked);
    setError(inputs, missing ? msg.choice : '');
    if (missing && (!first || group.compareDocumentPosition(first) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      first = inputs[0];
    }
  }
  return first;
}

function revalidateOne(el: Control, msg: Messages) {
  const group = el.closest<HTMLElement>('[data-choice-group]');
  if (group) {
    const inputs = [...group.querySelectorAll<HTMLInputElement>('input')];
    if (inputs.some((i) => i.getAttribute('aria-invalid') === 'true')) {
      const missing = group.dataset.required === 'true' && !inputs.some((i) => i.checked);
      setError(inputs, missing ? msg.choice : '');
    }
    return;
  }
  if (el.getAttribute('aria-invalid') === 'true') setError([el], validateControl(el, msg));
}

function initForm(form: HTMLFormElement) {
  const msg = JSON.parse(form.dataset.messages || '{}') as Messages;
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const steps = [...form.querySelectorAll<HTMLElement>('[data-step]')];
  const stepper = form.querySelector<HTMLElement>('[data-stepper]');
  const stepLabel = form.querySelector<HTMLElement>('[data-step-label]');
  const stepItems = [...form.querySelectorAll<HTMLElement>('[data-step-item]')];
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]');
  const submitContent = submit ? [...submit.childNodes].map((n) => n.cloneNode(true)) : [];
  let current = 0;

  form.noValidate = true;

  const showStatus = (text: string, tone: 'error' | 'info' = 'error') => {
    if (!status) return;
    status.dataset.tone = tone;
    status.setAttribute('role', tone === 'error' ? 'alert' : 'status');
    status.textContent = text;
  };
  const clearStatus = () => {
    if (status) status.textContent = '';
  };

  const showStep = (index: number, focus = true) => {
    current = index;
    steps.forEach((step, i) => (step.hidden = i !== index));
    stepItems.forEach((item, i) => {
      item.dataset.state = i < index ? 'done' : i === index ? 'current' : 'todo';
      if (i === index) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
    if (stepLabel) {
      const title = steps[index].querySelector('[data-step-title]')?.textContent?.trim() ?? '';
      stepLabel.textContent = `${msg.stepOf.replace('{n}', String(index + 1)).replace('{total}', String(steps.length))} — ${title}`;
    }
    if (focus) {
      steps[index].querySelector<HTMLElement>('[data-step-title]')?.focus();
      const top = form.getBoundingClientRect().top + window.scrollY - 110;
      if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const focusInvalid = (el: Control) => {
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  if (steps.length > 1) {
    form.classList.add('form--stepped');
    stepper?.removeAttribute('hidden');
    form.querySelectorAll<HTMLElement>('[data-step-nav]').forEach((el) => el.removeAttribute('hidden'));
    showStep(0, false);

    form.addEventListener('click', (event) => {
      const target = (event.target as Element).closest<HTMLButtonElement>('[data-next], [data-prev]');
      if (!target) return;
      clearStatus();
      if (target.hasAttribute('data-prev')) {
        showStep(Math.max(0, current - 1));
        return;
      }
      const invalid = validate(steps[current], msg);
      if (invalid) {
        focusInvalid(invalid);
        return;
      }
      showStep(Math.min(steps.length - 1, current + 1));
    });

    // « Entrée » dans un champ texte d'une étape intermédiaire : passer à l'étape suivante.
    form.addEventListener('keydown', (event) => {
      const el = event.target as HTMLElement;
      if (event.key !== 'Enter' || el.tagName !== 'INPUT' || current === steps.length - 1) return;
      event.preventDefault();
      steps[current].querySelector<HTMLButtonElement>('[data-next]')?.click();
    });
  }

  form.addEventListener('input', (e) => revalidateOne(e.target as Control, msg));
  form.addEventListener('change', (e) => revalidateOne(e.target as Control, msg));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearStatus();

    // Valider chaque étape dans l'ordre et revenir à la première étape incomplète.
    const scopes: ParentNode[] = steps.length ? steps : [form];
    for (let i = 0; i < scopes.length; i++) {
      const invalid = validate(scopes[i], msg);
      if (invalid) {
        if (steps.length > 1 && i !== current) showStep(i, false);
        showStatus(msg.summary);
        focusInvalid(invalid);
        return;
      }
    }

    if (isLocalPreview) {
      showStatus(msg.local, 'info');
      return;
    }

    if (submit) {
      const spinner = document.createElement('span');
      spinner.className = 'spinner';
      spinner.setAttribute('aria-hidden', 'true');
      submit.disabled = true;
      submit.replaceChildren(spinner, document.createTextNode(` ${msg.sending}`));
    }
    try {
      const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString();
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      window.location.assign(form.getAttribute('action') || '/');
    } catch {
      showStatus(msg.submit);
      if (submit) {
        submit.disabled = false;
        submit.replaceChildren(...submitContent.map((n) => n.cloneNode(true)));
      }
    }
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach(initForm);
