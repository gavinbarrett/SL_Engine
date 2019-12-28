import { RenderLanding } from './landing.js';

class App extends React.Component {
	render() {
		return (<RenderLanding />);
	}
}

// Launch Organon Landing Page
ReactDOM.render(<App />, document.getElementById("root"));
