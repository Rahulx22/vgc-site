import Header from './components/Header'
import HeroCarousel from './components/HeroCarousel'
import Services from './components/Services'
import Blog from './components/Blog'
import Clients from './components/Clients'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import homeData from '../data/home.json'
import { HomeData } from '../types/home'


export default function Page(){
const data = homeData as HomeData
return (
<>
<Header />
<HeroCarousel hero={data.hero} />
<Services services={data.services} />
<Blog items={data.blog} />
<Clients items={data.clients} />
<Testimonials items={data.testimonials} />
<div className="ready-sec">
<div className="container">
<div className="row">
<div className="col-lg-12 col-md-12" data-aos="fade-left" data-aos-duration="1200">
<h3>Get Started Today!</h3>
<h2>Ready to Take Your Business to the Next Level?</h2>
<p>Don't let finance and tax problems hold you back. At VGC Advisors, we are committed to empowering your business with expert financial advice and tailored solutions. Contact us today to learn how we can help you thrive.</p>
<a href={`tel:${data.hero.phone}`}>Make a Call {data.hero.phone}</a>
</div>
</div>
</div>
</div>
<Footer footer={data.footer} />
</>
)
}