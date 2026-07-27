import './index.css';
import { GenPassword } from './features/gen-password';
import { render } from 'solid-js/web';


const root = document.getElementById('root');
if (root) {
  render(() => <GenPassword />, root);
}
