import Link from "next/link";
import Image from "next/image";

export default function Footer({ footer }: { footer: any }) {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-xl-4 col-lg-4 col-md-4">
            <Link href="/" aria-label="Home">
              <Image
                src="/images/logo.svg"
                alt="logo"
                width={150}
                height={50}
                loading="lazy"
              />
            </Link>

            <p>
              Don't let finance and tax problems hold you back. At VGC Advisors, we are committed to empowering your business with expert financial advice and tailored solutions. Contact us today to learn how we can help you thrive.
            </p>

            <ul className="info-list">
              <li>
                <a href={`tel:${footer.phone}` } style={{ display: "inline-flex", alignItems: "center"}}>
                  <Image
                    src="/images/ph.svg"
                    alt="phone icon"
                    width={15}
                    height={15}
                    loading="lazy"
                  />{" "}
                    <span style={{ paddingLeft: "3px" }}>{footer.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${footer.email}`} style={{ display: "inline-flex", alignItems: "center"}}>
                  <Image
                    src="/images/ms.svg"
                    alt="email icon"
                    width={15}
                    height={15}
                    loading="lazy"
                  />{" "}
                  <span style={{ paddingLeft: "3px" }}>{footer.email}</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="col-xl-3 col-lg-3 col-md-2 offset-xl-1">
            <h2>Navigation</h2>
            <ul>
              <li>
                <Link href="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="footer-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/service" className="footer-link">
                  Service
                </Link>
              </li>
              <li>
                <Link href="/career" className="footer-link">
                  Career
                </Link>
              </li>
              <li>
                <Link href="/blog" className="footer-link">
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-xl-4 col-lg-5 col-md-6">
            <ul className="social-icon">
              {footer.social.map((s: string, i: number) => (
                <li key={i}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={s}
                    aria-label={`Social link ${i + 1}`}
                  >
                    <Image
                      src="/images/fb.svg"
                      alt="social icon"
                      width={30}
                      height={30}
                      loading="lazy"
                    />
                  </a>
                </li>
              ))}
            </ul>

            <h2>Subscribe Our Newsletter</h2>
            <p>
              Egestas tempus neque amet suspendisse ornare nibh elit morbi. Leo iaculis proin orci sed.
            </p>
            <form>
              <input className="box" type="text" placeholder="Your Email" />
              <input type="submit" className="call-btn" value="Subscribe" />
            </form>
          </div>

          {/* Copyright */}
          <div className="col-lg-12 col-md-12">
            <div className="copy-txt">
              <h6>VGC Consulting Opt.</h6>
              <center>
                <h6>{footer.copyright}</h6>
              </center>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
