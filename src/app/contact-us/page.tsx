import ContactForm from "../components/ContactForm";
import ContactInfo from "../components/ContactInfo";
import contactData from "../../data/contact.json";
import { ContactPage } from "../../types/pages";

export default function ContactUsPage() {
  const data: ContactPage = contactData;

  return (
    <>
      <div className="contact-sec">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-12">
              <ContactForm title={data.form.title} />
            </div>
            
            <div className="col-xl-6 col-lg-6 col-md-12">
              <ContactInfo 
                addresses={data.addresses}
                locations={data.locations}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
