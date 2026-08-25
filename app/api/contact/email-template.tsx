import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';

interface ContactEmailTemplateProps {
  name: string;
  email: string;
  interest: string;
  message: string;
  receivedAt: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://azeonics.com';

export default function ContactEmailTemplate({
  name,
  email,
  interest,
  message,
  receivedAt,
}: ContactEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>New inquiry from {name} - {interest}</Preview>
      <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <Container style={{ maxWidth: '680px', margin: '0 auto', marginTop: '20px' }}>
          {/* Header */}
          <Section
            style={{
              backgroundColor: '#0D1117',
              padding: '50px 30px',
              textAlign: 'center',
              borderBottom: '4px solid #3E6AE1',
              borderRadius: '8px 8px 0 0',
            }}
          >
            <Text style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 12px 0' }}>
              🚀 Azeonics
            </Text>
            <Text style={{ fontSize: '14px', color: '#888', letterSpacing: '1px', margin: '0', textTransform: 'uppercase' }}>
              Idea to Orbit Innovation Hub
            </Text>
          </Section>

          {/* Alert Banner */}
          <Section style={{ backgroundColor: '#fffbeb', borderLeft: '4px solid #fbbf24', padding: '16px 30px' }}>
            <Text style={{ color: '#92400e', fontSize: '14px', margin: '0', fontWeight: '500' }}>
              ⚡ New Inquiry Received
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={{ padding: '40px 30px', backgroundColor: '#ffffff' }}>
            <Text style={{ color: '#0D1117', fontSize: '24px', fontWeight: '600', marginBottom: '32px', margin: 0 }}>
              New Contact Form Submission
            </Text>

            {/* Inquiry Details Card */}
            <Section
              style={{
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                padding: '24px',
                marginBottom: '32px',
                border: '1px solid #e5e7eb',
              }}
            >
              <Row>
                <Section style={{ marginBottom: '20px' }}>
                  <Text style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    From
                  </Text>
                  <Text style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                    {name}
                  </Text>
                  <Text style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                    {email}
                  </Text>
                </Section>
              </Row>

              <Row>
                <Section style={{ marginBottom: '20px' }}>
                  <Text style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Interested In
                  </Text>
                  <Text style={{ display: 'inline-block', backgroundColor: '#dbeafe', color: '#1e40af', padding: '6px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', margin: 0 }}>
                    {interest}
                  </Text>
                </Section>
              </Row>

              <Row>
                <Section>
                  <Text style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Received
                  </Text>
                  <Text style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    {receivedAt} IST
                  </Text>
                </Section>
              </Row>
            </Section>

            {/* Message */}
            <Section style={{ marginBottom: '32px' }}>
              <Text style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Message
              </Text>
              <Section
                style={{
                  backgroundColor: '#fafafa',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '16px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  color: '#374151',
                  fontSize: '14px',
                  lineHeight: '1.6',
                }}
              >
                <Text style={{ margin: 0 }}>{message}</Text>
              </Section>
            </Section>

            {/* Action Items */}
            <Section
              style={{
                backgroundColor: '#ecf7ff',
                border: '1px solid #3E6AE1',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '32px',
              }}
            >
              <Text style={{ color: '#1e40af', fontSize: '14px', fontWeight: '600', margin: '0 0 12px 0' }}>
                📋 Next Steps
              </Text>
              <ul style={{ color: '#1e40af', fontSize: '14px', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
                <li>Review the inquiry details above</li>
                <li>Assess feasibility and available slots</li>
                <li>Send response to {email} within one working day</li>
                <li>Include quotation or scheduling options as applicable</li>
              </ul>
            </Section>

            {/* Quick Links */}
            <Section
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '32px',
              }}
            >
              <Text style={{ color: '#15803d', fontSize: '14px', fontWeight: '600', margin: '0 0 12px 0' }}>
                🔗 Useful Resources
              </Text>
              <ul style={{ color: '#15803d', fontSize: '14px', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
                <li>
                  <Link href={`${baseUrl}/capabilities`} style={{ color: '#15803d', textDecoration: 'none' }}>
                    View Capabilities
                  </Link>
                </li>
                <li>
                  <Link href={`${baseUrl}/catalog`} style={{ color: '#15803d', textDecoration: 'none' }}>
                    Explore Catalog
                  </Link>
                </li>
                <li>
                  <Link href={`${baseUrl}/skilling`} style={{ color: '#15803d', textDecoration: 'none' }}>
                    Skilling Programs
                  </Link>
                </li>
              </ul>
            </Section>

            {/* Contact Info */}
            <Section
              style={{
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <Text style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 12px 0' }}>
                <strong>Follow up contact:</strong>
              </Text>
              <Text style={{ color: '#1f2937', fontSize: '14px', margin: '0 0 4px 0' }}>
                📧{' '}
                <Link href="mailto:info@azeonics.com" style={{ color: '#3E6AE1', textDecoration: 'none' }}>
                  info@azeonics.com
                </Link>
              </Text>
              <Text style={{ color: '#1f2937', fontSize: '14px', margin: 0 }}>
                📱{' '}
                <Link href="tel:+91-9668913303" style={{ color: '#3E6AE1', textDecoration: 'none' }}>
                  +91-9668913303
                </Link>
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section
            style={{
              backgroundColor: '#f9fafb',
              borderTop: '1px solid #e5e7eb',
              padding: '24px 30px',
              textAlign: 'center',
              borderRadius: '0 0 8px 8px',
            }}
          >
            <Text style={{ color: '#6b7280', fontSize: '12px', margin: '0 0 8px 0' }}>
              Azeonics Private Limited | ISRO-grade Manufacturing & Testing Hub
            </Text>
            <Text style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>
              Thane, Maharashtra · India |{' '}
              <Link href={baseUrl} style={{ color: '#3E6AE1', textDecoration: 'none' }}>
                azeonics.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
