import './index.css';
import { render } from 'solid-js/web';

import { GenPassword } from './features/gen-password';

const root = document.getElementById('root');
if (root) {
  render(() => <GenPassword />, root);
}
