import Image from "next/image";
import Link from "next/link";

interface ContactDetail {
  label: string;
  value: string;
  link?: string;
}

interface ContactAddress {
  title: string;
  icon: string;
  details: ContactDetail[];
}

interface ContactInfoProps {
  addresses: ContactAddress[];
  locations: Array<{ name: string; link: string }>;
}

export default function ContactInfo({ addresses, locations }: ContactInfoProps) {
  return (
    <div className="cont-box">
      {addresses.map((address, index) => (
        <div key={index}>
          <h3>
            <Image 
              src={address.icon} 
              alt="icon" 
              width={20} 
              height={20} 
              loading="lazy" 
            /> {address.title}
          </h3>
          <ul>
            {address.details.map((detail, detailIndex) => (
              <li key={detailIndex}>
                {detail.label && <span>{detail.label} </span>}
                {detail.link ? (
                  <Link href={detail.link}>{detail.value}</Link>
                ) : (
                  <span>{detail.value}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
      
      <ul className="cont-list">
        {locations.map((location, index) => (
          <li key={index}>
            <Link href={location.link}>{location.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
