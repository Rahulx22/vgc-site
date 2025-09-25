import Image from 'next/image'
import { TestimonialsSection } from '../../types/home'


export default function Testimonials({ testimonials }: { testimonials: TestimonialsSection }){
return (
<div className="testimonial-sec">
<div className="container">
<div className="row">
<div className="col-xl-5 col-lg-6 col-md-10"><h2 data-aos="fade-up" data-aos-duration="1200">{testimonials.left_text}</h2></div>
<div className="col-xl-5 col-lg-6 col-md-12 offset-xl-2">
<h4>{testimonials.right_text}</h4>
<h3>{testimonials.right_subtext}</h3>
<div className="comma-icon"><strong><Image src="/images/comma.svg" alt="comma" width={30} height={30} loading="lazy"/></strong></div>
<div id="testimonial-sec" className="owl-carousel">
{testimonials.items.map((t,i)=> (
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