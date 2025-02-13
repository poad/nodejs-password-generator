import { render } from 'solid-js/web';
import './index.css';

import { GenPassword } from './features/gen-password';

const root = document.getElementById('root');
if (root) {
  render(() => <GenPassword />, root);
}
