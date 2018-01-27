import p5 from 'p5';

const skecth = (p5) =>{
	const width = p5.windowWidth;
	const height = p5.windowHeight;

	window.p5 =p5;


	p5.setup = () =>{
		const canvas = p5.createCanvas(width,height);
		canvas.parent('skecth');
		p5.background(55);
	}


}

export default sketch;