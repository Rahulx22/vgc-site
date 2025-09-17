import Link from "next/link";
import Image from "next/image";
import { Service } from "../../types/home";

export default function Services({ services }: { services: Service[] }) {
  return (
    <div className="service-sec">
      <div className="container">
        {/* Counters */}
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <ul className="count-list">
              <li>
                <h2>
                  <span className="counter-count">15</span>%
                </h2>
                Revenue Growth Rate
              </li>
              <li>
                <h2>
                  <span className="counter-count">90</span>%
                </h2>
                Client Retention Rate
              </li>
              <li>
                <h2>
                  <span className="counter-count">12</span>+
                </h2>
                Years in Operation
              </li>
            </ul>
          </div>
        </div>

        {/* Services */}
        <div className="row">
          <div className="col-xl-10 col-lg-12 col-md-12 offset-xl-1">
            <h2 data-aos="fade-up" data-aos-duration="1200">
              Our Services
            </h2>
            <div className="row">
              {services.map((s, i) => (
                <div key={i} className="col-lg-6 col-md-6">
                  <div
                    className="serv-box"
                    data-aos="zoom-in"
                    data-aos-duration="1200"
                  >
                    <strong>
                      <Image
                        src="/images/check.svg"
                        alt="check"
                        width={20}
                        height={20}
                        loading="lazy"
                      />
                    </strong>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>

                    <Link href={s.link} className="learn-link">
                      Learn More
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* See All Services */}
            <Link href="/service.html" className="see-btn">
              See All Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
