import Image from 'next/image'
import { Testimonial } from '../../types/home'

type TestimonialsProps = {
  items: Testimonial[];
  leftText?: string;
  rightText?: string;
  rightSubtext?: string;
};

export default function Testimonials({ items, leftText = "Building Trust Through Results", rightText = "Testimonials", rightSubtext = "Client Success Stories: Hear What They Say" }: TestimonialsProps){
return (
<div className="testimonial-sec">
<div className="container">
<div className="row">
<div className="col-xl-5 col-lg-6 col-md-10"><h2 data-aos="fade-up" data-aos-duration="1200">{leftText}</h2></div>
<div className="col-xl-5 col-lg-6 col-md-12 offset-xl-2">
<h4>{rightText}</h4>
<h3>{rightSubtext}</h3>
<div className="comma-icon"><strong><Image src="/images/comma.svg" alt="comma" width={30} height={30} loading="lazy"/></strong></div>
<div id="testimonial-sec" className="owl-carousel">
{items.map((t,i)=> (
<div key={i}>
<p>{t.text}</p>
<div className="client-img">
<h5><strong>{'★'.repeat(parseInt(t.rating || '5'))}</strong> {t.author}</h5>
<Image src={t.avatar} alt={t.author} width={56} height={56} loading="lazy"/>
</div>
</div>
))}
</div>
</div>
</div>
</div>
</div>
)
}