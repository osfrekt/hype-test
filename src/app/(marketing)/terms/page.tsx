import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 py-12">
        <article className="max-w-3xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Last updated: April 2026
          </p>

          <nav className="mb-8 bg-muted/30 rounded-xl p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Contents</p>
            <ol className="space-y-1 text-sm text-muted-foreground">
              <li><a href="#acceptance" className="hover:text-primary">1. Acceptance of Terms</a></li>
              <li><a href="#description" className="hover:text-primary">2. Description of Service</a></li>
              <li><a href="#accounts" className="hover:text-primary">3. Account Registration and Security</a></li>
              <li><a href="#plans" className="hover:text-primary">4. Free and Paid Plans</a></li>
              <li><a href="#billing" className="hover:text-primary">5. Billing and Cancellation</a></li>
              <li><a href="#disclaimer" className="hover:text-primary">6. Research Output Disclaimer</a></li>
              <li><a href="#liability" className="hover:text-primary">7. Limitation of Liability</a></li>
              <li><a href="#ip" className="hover:text-primary">8. Intellectual Property</a></li>
              <li><a href="#data-handling" className="hover:text-primary">9. Data Handling and Public Accessibility</a></li>
              <li><a href="#acceptable-use" className="hover:text-primary">10. Acceptable Use</a></li>
              <li><a href="#indemnification" className="hover:text-primary">11. Indemnification</a></li>
              <li><a href="#third-party" className="hover:text-primary">12. Third-Party References</a></li>
              <li><a href="#trademarks" className="hover:text-primary">13. Trademarks and Third-Party Content</a></li>
              <li><a href="#availability" className="hover:text-primary">14. Service Availability</a></li>
              <li><a href="#suspension" className="hover:text-primary">15. Suspension and Termination</a></li>
              <li><a href="#modifications" className="hover:text-primary">16. Modifications to Service and Terms</a></li>
              <li><a href="#disputes" className="hover:text-primary">17. Dispute Resolution and Arbitration</a></li>
              <li><a href="#class-action" className="hover:text-primary">18. Class Action Waiver</a></li>
              <li><a href="#general" className="hover:text-primary">19. General Provisions</a></li>
              <li><a href="#contact" className="hover:text-primary">20. Contact</a></li>
            </ol>
          </nav>

          {/* 1. Acceptance of Terms */}
          <section className="space-y-4 mb-10">
            <h2 id="acceptance" className="text-xl font-bold text-primary">
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using HypeTest (&quot;the Service&quot;), operated
              by Rekt Brands Inc., 1207 Delaware Ave, #4069, Wilmington, DE
              19806 (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;), you (&quot;User,&quot; &quot;you,&quot; or
              &quot;your&quot;) agree to be bound by these Terms of Service
              (&quot;Terms&quot;). If you do not agree to these Terms, do not
              access or use the Service.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If you are accepting these Terms on behalf of a company or other
              legal entity, you represent and warrant that you have the
              authority to bind that entity to these Terms. In that case,
              &quot;you&quot; and &quot;your&quot; refer to that entity.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By creating an account, clicking &quot;I agree,&quot; or
              otherwise using the Service, you consent to receive
              communications from us electronically, including emails, in-app
              notifications, and updates posted on the Service. You agree that
              all agreements, notices, disclosures, and other communications
              that we provide to you electronically satisfy any legal
              requirement that such communications be in writing.
            </p>
          </section>

          {/* 2. Description of Service */}
          <section className="space-y-4 mb-10">
            <h2 id="description" className="text-xl font-bold text-primary">
              2. Description of Service
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              HypeTest provides AI-simulated consumer research. The Service uses
              large language models to simulate consumer responses to product
              concepts, pricing, and positioning. HypeTest does not operate real
              consumer panels, focus groups, or surveys with human participants.
              All &quot;respondents&quot; referenced in research results are
              AI-simulated personas.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The features, functionality, and scope of the Service may vary
              depending on your subscription plan and may change at any time.
              We reserve the sole right to modify, enhance, replace, or
              discontinue any feature, tool, report type, AI model, or aspect
              of the Service at any time, with or without notice, in accordance
              with Section 16. Your subscription provides access to the Service
              as it exists at the time of use, not to any fixed set of features.
            </p>
          </section>

          {/* 3. Account Registration and Security */}
          <section className="space-y-4 mb-10">
            <h2 id="accounts" className="text-xl font-bold text-primary">
              3. Account Registration and Security
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              To use certain features of the Service, you must create an
              account. When registering, you agree to provide accurate, current,
              and complete information, and to update that information as
              necessary.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>
                You are responsible for maintaining the confidentiality of your
                account credentials, including your password and any
                authentication tokens.
              </li>
              <li>
                You are responsible for all activity that occurs under your
                account, whether or not authorized by you.
              </li>
              <li>
                Each account is for a single individual. You must not share
                your login credentials with others.
              </li>
              <li>
                You must notify us immediately at{" "}
                <a
                  href="mailto:support@hypetest.ai"
                  className="text-primary underline"
                >
                  support@hypetest.ai
                </a>{" "}
                if you suspect any unauthorized access to or use of your
                account.
              </li>
              <li>
                We are not liable for any loss or damage arising from your
                failure to protect your account credentials.
              </li>
            </ul>
          </section>

          {/* 4. Free and Paid Plans */}
          <section className="space-y-4 mb-10">
            <h2 id="plans" className="text-xl font-bold text-primary">
              4. Free and Paid Plans
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              HypeTest offers a free tier with limited functionality and paid
              subscription plans with additional features and higher usage
              limits. Details of available plans and their respective features
              are described on our pricing page.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>
                The free tier is provided at our discretion and may be modified,
                limited, or discontinued at any time without prior notice.
              </li>
              <li>
                Free-tier accounts that remain inactive for more than 12
                consecutive months may be subject to deletion, including any
                associated data.
              </li>
              <li>
                Usage limits on the free tier (such as the number of research
                runs) are enforced automatically. Exceeding those limits
                requires upgrading to a paid plan.
              </li>
              <li>
                We reserve the right to change pricing for paid plans at any
                time. Pricing changes for existing subscribers will take effect
                at the start of the next billing cycle following at least 30
                days&apos; prior written notice (via email or in-app
                notification).
              </li>
            </ul>
          </section>

          {/* 5. Billing and Cancellation */}
          <section className="space-y-4 mb-10">
            <h2 id="billing" className="text-xl font-bold text-primary">
              5. Billing and Cancellation
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Paid subscriptions are billed in advance on a recurring basis
              (monthly or annually, depending on the plan you select). By
              subscribing to a paid plan, you authorize us to charge your
              designated payment method at the beginning of each billing cycle.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>
                <strong>Auto-Renewal.</strong> Subscriptions automatically renew
                at the end of each billing period unless you cancel before the
                renewal date.
              </li>
              <li>
                <strong>Cancellation.</strong> You may cancel your subscription
                at any time through the customer portal accessible from your
                account page, or by contacting{" "}
                <a
                  href="mailto:support@hypetest.ai"
                  className="text-primary underline"
                >
                  support@hypetest.ai
                </a>
                . Cancellation takes effect at the end of your current billing
                period. You will retain access to paid features until that date.
              </li>
              <li>
                <strong>No Refunds.</strong> No prorated refunds are provided
                for partial billing periods or unused portions of a
                subscription. Upon cancellation, your account reverts to the
                free plan and your existing research data remains accessible
                via existing links.
              </li>
              <li>
                <strong>Payment Disputes.</strong> If you believe you were
                charged in error, contact{" "}
                <a
                  href="mailto:support@hypetest.ai"
                  className="text-primary underline"
                >
                  support@hypetest.ai
                </a>{" "}
                within 30 days of the charge for review.
              </li>
              <li>
                <strong>Failed Payments.</strong> If a payment fails, we may
                suspend your access to paid features until payment is
                successfully processed. We may retry the charge or request
                updated payment information.
              </li>
            </ul>
          </section>

          {/* 6. Research Output Disclaimer */}
          <section className="space-y-4 mb-10">
            <h2 id="disclaimer" className="text-xl font-bold text-primary">
              6. Research Output Disclaimer
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Research results generated by HypeTest are intended for
              directional insights and hypothesis generation only. They are not
              a substitute for professional market research conducted with real
              human participants.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>
                Results have not been validated for use in high-stakes business
                decisions, including but not limited to product launches, large
                capital investments, or regulatory filings.
              </li>
              <li>
                HypeTest makes no guarantee of accuracy, completeness, or
                reliability of any simulated research output.
              </li>
              <li>
                HypeTest does not guarantee that any product concept, pricing
                strategy, name, creative, or business idea evaluated through
                the Service will succeed commercially.
              </li>
              <li>
                Any decisions made based on HypeTest results are made entirely
                at your own risk.
              </li>
              <li>
                HypeTest is not liable for any financial losses, missed
                opportunities, failed product launches, or other damages
                resulting from actions taken based on research outputs
                generated by the Service.
              </li>
            </ul>
          </section>

          {/* 7. Limitation of Liability */}
          <section className="space-y-4 mb-10">
            <h2 id="liability" className="text-xl font-bold text-primary">
              7. Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
                AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS
                OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                NON-INFRINGEMENT.
              </strong>
            </p>
            <p className="text-muted-foreground leading-relaxed">
              HypeTest provides no warranty on the accuracy, relevance, or
              applicability of simulated research results. HypeTest does not
              guarantee any specific outcome, commercial success, or return on
              investment from using the Service. You assume all risk when
              interpreting or acting on results generated by the Service.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, HYPETEST
                AND REKT BRANDS INC., INCLUDING ITS OFFICERS, DIRECTORS,
                EMPLOYEES, AGENTS, AFFILIATES, SUCCESSORS, AND ASSIGNS, SHALL
                NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED
                TO LOSS OF PROFITS, REVENUE, DATA, BUSINESS OPPORTUNITIES,
                GOODWILL, OR USE, ARISING FROM OR RELATED TO YOUR USE OF (OR
                INABILITY TO USE) THE SERVICE, WHETHER BASED ON WARRANTY,
                CONTRACT, TORT (INCLUDING NEGLIGENCE), STATUTE, OR ANY OTHER
                LEGAL THEORY, EVEN IF HYPETEST HAS BEEN ADVISED OF THE
                POSSIBILITY OF SUCH DAMAGES.
              </strong>
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>
                IN NO EVENT SHALL THE TOTAL AGGREGATE LIABILITY OF HYPETEST AND
                REKT BRANDS INC. FOR ALL CLAIMS ARISING OUT OF OR RELATING TO
                THESE TERMS OR THE SERVICE EXCEED THE GREATER OF (A) THE TOTAL
                FEES YOU HAVE ACTUALLY PAID TO HYPETEST IN THE TWELVE (12)
                MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE
                CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS ($100 USD).
              </strong>
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Some jurisdictions do not allow the exclusion or limitation of
              certain warranties or damages. In those jurisdictions, the above
              limitations apply only to the fullest extent permitted by
              applicable law.
            </p>
          </section>

          {/* 8. Intellectual Property */}
          <section className="space-y-4 mb-10">
            <h2 id="ip" className="text-xl font-bold text-primary">
              8. Intellectual Property
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Your Content.</strong> You retain full ownership of your
              input data, including product descriptions, brand information, and
              research parameters that you submit to the Service
              (&quot;User Content&quot;). You grant us a limited,
              non-exclusive, worldwide, royalty-free license to use, process,
              and store your User Content solely for the purpose of providing
              and improving the Service.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Aggregated Data.</strong> HypeTest retains the right to
              use anonymized, aggregated data derived from Service usage to
              improve and develop the Service. &quot;Anonymized&quot; means all
              identifying information (brand names, company names, specific
              product names, and user identity) is removed before any
              aggregated use.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Our Property.</strong> The Service, including its
              software, algorithms, models, user interface, design,
              documentation, and all related intellectual property, is and
              remains the exclusive property of Rekt Brands Inc. The HypeTest
              name, logo, and website content are the property of Rekt Brands
              Inc. and may not be reproduced without permission. Nothing in
              these Terms grants you any right, title, or interest in the
              Service except the limited right to use it in accordance with
              these Terms.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Feedback.</strong> If you provide us with suggestions,
              ideas, feature requests, enhancement requests, recommendations,
              or other feedback regarding the Service (&quot;Feedback&quot;),
              you grant us an unrestricted, irrevocable, perpetual, royalty-free
              license to use, modify, and incorporate that Feedback into the
              Service or any other product without any obligation or
              compensation to you.
            </p>
          </section>

          {/* 9. Data Handling and Public Accessibility */}
          <section className="space-y-4 mb-10">
            <h2 id="data-handling" className="text-xl font-bold text-primary">
              9. Data Handling and Public Accessibility
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Research inputs and results are stored in our database.{" "}
              <strong>
                Research result pages are publicly accessible to anyone with the
                unique URL.
              </strong>{" "}
              You should not include trade secrets, confidential business
              information, or sensitive proprietary data in your research
              inputs. By submitting research, you acknowledge that the results
              will be accessible via a shareable link.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You may request deletion of your data by contacting us at{" "}
              <a
                href="mailto:support@hypetest.ai"
                className="text-primary underline"
              >
                support@hypetest.ai
              </a>
              . We will process deletion requests within a reasonable
              timeframe. For more details on how we collect, use, and protect
              your personal information, see our{" "}
              <a href="/privacy" className="text-primary underline">
                Privacy Policy
              </a>
              .
            </p>
          </section>

          {/* 10. Acceptable Use */}
          <section className="space-y-4 mb-10">
            <h2 id="acceptable-use" className="text-xl font-bold text-primary">
              10. Acceptable Use
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to use the Service only for lawful purposes and in
              compliance with these Terms. You must not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>
                Use the Service for any fraudulent, misleading, or illegal
                purpose.
              </li>
              <li>
                Present AI-simulated research results to third parties as real
                consumer research without clearly disclosing that the results
                were generated using AI-simulated methodology.
              </li>
              <li>
                Use research results to publicly disparage, defame, or mislead
                about competing products or brands.
              </li>
              <li>
                Access the Service via automated means (bots, scripts, scrapers)
                without prior written permission from Rekt Brands Inc.
              </li>
              <li>
                Resell, redistribute, or white-label the Service or its outputs
                without prior written permission.
              </li>
              <li>
                Reverse engineer, decompile, disassemble, or attempt to derive
                the source code, algorithms, or underlying models of the
                Service.
              </li>
              <li>
                Use the Service to generate content that is defamatory, hateful,
                harassing, obscene, or that violates the rights of others.
              </li>
              <li>
                Submit content that infringes on any patent, trademark, trade
                secret, copyright, or other proprietary right of any third
                party.
              </li>
              <li>
                Attempt to interfere with, compromise, or disrupt the Service
                or its infrastructure, including through the introduction of
                viruses, malicious code, or denial-of-service attacks.
              </li>
              <li>
                Circumvent or attempt to circumvent any usage limits, access
                controls, or security measures of the Service.
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to investigate and take appropriate action
              against any violation of these Terms, including suspending or
              terminating your account in accordance with Section 15.
            </p>
          </section>

          {/* 11. Indemnification */}
          <section className="space-y-4 mb-10">
            <h2 id="indemnification" className="text-xl font-bold text-primary">
              11. Indemnification
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify, defend, and hold harmless Rekt Brands
              Inc., its officers, directors, employees, agents, affiliates,
              successors, and assigns (collectively, the &quot;Indemnified
              Parties&quot;) from and against any and all claims, demands,
              damages, losses, liabilities, costs, and expenses (including
              reasonable attorneys&apos; fees and court costs) arising out of or
              related to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>
                Your use of the Service or any activity under your account.
              </li>
              <li>
                Your violation of these Terms.
              </li>
              <li>
                Your violation of any applicable law or regulation.
              </li>
              <li>
                Any misrepresentation of AI-simulated research results as
                real consumer research.
              </li>
              <li>
                Any claim by a third party that your User Content or your use
                of the Service infringes or violates that third party&apos;s
                intellectual property or other rights.
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right, at your expense, to assume the exclusive
              defense and control of any matter for which you are required to
              indemnify us, and you agree to cooperate with our defense of such
              claims. You agree not to settle any such matter without our prior
              written consent.
            </p>
          </section>

          {/* 12. Third-Party References */}
          <section className="space-y-4 mb-10">
            <h2 id="third-party" className="text-xl font-bold text-primary">
              12. Third-Party References
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service and its website may reference academic research,
              publications, or methodologies from institutions and organizations
              such as Harvard Business School, Nielsen, Ipsos, McKinsey, and
              others. These references are provided for informational and
              educational purposes only and do not imply any endorsement,
              partnership, sponsorship, or affiliation between HypeTest and
              those entities.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The Service may contain links to third-party websites or services
              that are not owned or controlled by Rekt Brands Inc. We have no
              control over, and assume no responsibility for, the content,
              privacy policies, or practices of any third-party websites or
              services. You acknowledge and agree that we are not responsible
              or liable for any damage or loss caused by or in connection with
              the use of any third-party websites, services, or content.
            </p>
          </section>

          {/* 13. Trademarks and Third-Party Content */}
          <section className="space-y-4 mb-10">
            <h2 id="trademarks" className="text-xl font-bold text-primary">
              13. Trademarks and Third-Party Content
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              All brand names, product names, and trademarks mentioned on this
              website or within research results (including but not limited to
              names of consumer products, research firms, and academic
              institutions) are the property of their respective owners. Their
              use on this website is for illustrative, informational, or
              comparative purposes only and does not imply any endorsement,
              sponsorship, or affiliation.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Data and statistics attributed to third-party sources are
              approximate estimates based on publicly available information and
              may not reflect exact figures from those sources.
            </p>
          </section>

          {/* 14. Service Availability */}
          <section className="space-y-4 mb-10">
            <h2 id="availability" className="text-xl font-bold text-primary">
              14. Service Availability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We strive to maintain high availability of the Service, but we do
              not guarantee uninterrupted or error-free operation.{" "}
              <strong>
                HypeTest does not provide a Service Level Agreement (SLA) and
                makes no uptime commitments or guarantees.
              </strong>
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The Service may be temporarily unavailable due to scheduled
              maintenance, unscheduled maintenance, system failures,
              third-party service outages, or other factors beyond our
              reasonable control. We will make reasonable efforts to provide
              advance notice of planned downtime when feasible but are not
              obligated to do so.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The Service relies on third-party artificial intelligence
              infrastructure providers to generate research results. These
              providers operate independently and may experience outages,
              degraded performance, or changes to their services that are
              beyond our control. We maintain redundant AI provider
              relationships to minimize disruption, but we cannot guarantee
              uninterrupted AI service availability. In the event of an AI
              provider outage, research runs may be delayed or temporarily
              unavailable. No refunds or credits will be issued for delays
              caused by third-party AI provider issues.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We are not liable for any damages, losses, or costs resulting
              from Service downtime or unavailability, regardless of cause.
            </p>
          </section>

          {/* 15. Suspension and Termination */}
          <section className="space-y-4 mb-10">
            <h2 id="suspension" className="text-xl font-bold text-primary">
              15. Suspension and Termination
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Suspension.</strong> We may temporarily suspend your
              access to the Service, with or without notice, if we reasonably
              believe that: (a) you have violated these Terms; (b) your use
              poses a security risk to the Service or other users; (c) your
              use may subject us to legal liability; or (d) your account has
              an outstanding payment obligation. During suspension, your data
              will be preserved but inaccessible. We will make reasonable
              efforts to notify you of the reason for suspension and any steps
              required to restore access.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Termination by You.</strong> You may terminate your
              account at any time by canceling your subscription (if
              applicable) and contacting{" "}
              <a
                href="mailto:support@hypetest.ai"
                className="text-primary underline"
              >
                support@hypetest.ai
              </a>{" "}
              to request account deletion.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Termination by Us.</strong> We may terminate your account
              and access to the Service at any time, with or without cause, by
              providing notice to the email address associated with your
              account. We may terminate immediately and without notice for
              material violations of these Terms.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Effect of Termination.</strong> Upon termination: (a) your
              right to access and use the Service ceases immediately; (b) we
              have no obligation to retain your data, though publicly shared
              research links may remain accessible for a reasonable wind-down
              period; (c) you may request an export of your data within 30 days
              of termination by contacting{" "}
              <a
                href="mailto:support@hypetest.ai"
                className="text-primary underline"
              >
                support@hypetest.ai
              </a>
              , and we will provide it in a commonly used format where
              technically feasible; (d) any provisions of these Terms that by
              their nature should survive termination will survive, including
              Sections 6, 7, 8, 11, 17, 18, and 19.
            </p>
          </section>

          {/* 16. Modifications to Service and Terms */}
          <section className="space-y-4 mb-10">
            <h2 id="modifications" className="text-xl font-bold text-primary">
              16. Modifications to Service and Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Modifications to the Service.</strong> We reserve the
              sole and absolute right to modify, update, replace, suspend,
              limit, or discontinue the Service, or any features, tools,
              functionality, content, APIs, panel sizes, AI models, report
              formats, or other aspects of the Service, at any time, for any
              reason, with or without notice. This includes, without limitation,
              the right to add, change, or remove features; alter plan
              inclusions, usage limits, or quotas; change the AI models or
              methodologies used; restructure or rebrand the platform; modify
              pricing tiers and what each tier includes; and sunset any tool
              or report type. No modification to the Service shall entitle you
              to a refund, credit, or claim of any kind unless expressly
              provided otherwise in our refund policy.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>No Guaranteed Feature Set.</strong> The Service is
              provided on an &quot;as available&quot; basis with respect to
              features and functionality. We do not guarantee that any specific
              feature, tool, report type, or capability will remain available,
              unchanged, or supported for any period of time. Your subscription
              grants access to the Service as it exists at the time of use, not
              to any particular feature set, configuration, or version of the
              platform.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Modifications to Terms.</strong> We may update these
              Terms at any time by posting the revised version on this page and
              updating the &quot;Last updated&quot; date. For material changes
              to these Terms, we will make reasonable efforts to provide notice
              via email or in-app notification, but are not obligated to do so.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Your continued use of the Service after any changes to these
              Terms or the Service constitutes your acceptance of the revised
              Terms and modified Service. If you do not agree, you must stop
              using the Service and may cancel your account.
            </p>
          </section>

          {/* 17. Dispute Resolution and Arbitration */}
          <section className="space-y-4 mb-10">
            <h2 id="disputes" className="text-xl font-bold text-primary">
              17. Dispute Resolution and Arbitration
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Governing Law.</strong> These Terms and any dispute
              arising out of or relating to these Terms or the Service shall be
              governed by and construed in accordance with the laws of the
              State of Delaware, United States, without regard to its conflict
              of law provisions. The United Nations Convention on Contracts for
              the International Sale of Goods does not apply to these Terms.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Informal Resolution.</strong> Before initiating any
              formal dispute resolution proceeding, you agree to first contact
              us at{" "}
              <a
                href="mailto:support@hypetest.ai"
                className="text-primary underline"
              >
                support@hypetest.ai
              </a>{" "}
              and attempt to resolve the dispute informally for at least 30
              days. Most disputes can be resolved through good-faith
              communication.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Binding Arbitration.</strong> If the dispute is not
              resolved informally within 30 days, any dispute, claim, or
              controversy arising out of or relating to these Terms or the
              Service shall be resolved by binding arbitration administered by
              the American Arbitration Association (&quot;AAA&quot;) in
              accordance with its Consumer Arbitration Rules then in effect.
              The arbitration shall be conducted in Wilmington, Delaware, or,
              at your election, via telephone, video conference, or written
              submissions if you reside outside of Delaware. The arbitrator
              shall have exclusive authority to resolve all disputes arising
              out of or relating to the interpretation, applicability,
              enforceability, or formation of these Terms. The
              arbitrator&apos;s award shall be final and binding, and judgment
              on the award may be entered in any court of competent
              jurisdiction.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Exceptions.</strong> Notwithstanding the foregoing,
              either party may seek injunctive or other equitable relief in any
              court of competent jurisdiction to prevent the actual or
              threatened infringement, misappropriation, or violation of
              intellectual property rights. Additionally, if arbitration is not
              permitted under applicable law, any disputes shall be resolved
              exclusively in the state or federal courts located in the State
              of Delaware, and both parties consent to personal jurisdiction in
              those courts.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Limitation Period.</strong> Any claim arising under these
              Terms must be brought within one (1) year after the cause of
              action arises, or the claim is permanently barred.
            </p>
          </section>

          {/* 18. Class Action Waiver */}
          <section className="space-y-4 mb-10">
            <h2 id="class-action" className="text-xl font-bold text-primary">
              18. Class Action Waiver
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>
                YOU AND REKT BRANDS INC. AGREE THAT EACH PARTY MAY BRING
                CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL
                CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY
                PURPORTED CLASS, CONSOLIDATED, OR REPRESENTATIVE PROCEEDING.
              </strong>{" "}
              Unless both you and Rekt Brands Inc. agree otherwise in writing,
              the arbitrator may not consolidate more than one person&apos;s
              claims and may not otherwise preside over any form of a class,
              consolidated, or representative proceeding.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If this class action waiver is found to be unenforceable, then
              the entirety of the arbitration provision in Section 17 (other
              than the Governing Law and Exceptions subsections) shall be null
              and void, and the dispute shall proceed in court.
            </p>
          </section>

          {/* 19. General Provisions */}
          <section className="space-y-4 mb-10">
            <h2 id="general" className="text-xl font-bold text-primary">
              19. General Provisions
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Entire Agreement.</strong> These Terms, together with our
              Privacy Policy and any other policies or agreements referenced
              herein, constitute the entire agreement between you and Rekt
              Brands Inc. regarding the Service and supersede all prior and
              contemporaneous agreements, proposals, and communications,
              whether written or oral, relating to the subject matter of these
              Terms.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Severability.</strong> If any provision of these Terms is
              held to be invalid, illegal, or unenforceable by a court or
              arbitrator of competent jurisdiction, that provision shall be
              modified to the minimum extent necessary to make it enforceable,
              or, if modification is not possible, shall be severed from these
              Terms. The remaining provisions shall continue in full force and
              effect.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Waiver.</strong> The failure of Rekt Brands Inc. to
              exercise or enforce any right or provision of these Terms shall
              not constitute a waiver of such right or provision. Any waiver
              must be in writing and signed by us to be effective. A waiver of
              any right or provision on one occasion shall not be deemed a
              waiver of any other right or provision or of the same right or
              provision on any other occasion.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Assignment.</strong> You may not assign or transfer
              these Terms or any rights or obligations under these Terms
              without our prior written consent. Rekt Brands Inc. may freely
              assign or transfer these Terms, in whole or in part, without
              restriction and without notice to you, including in connection
              with a merger, acquisition, corporate restructuring, or sale of
              all or substantially all of our assets.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Force Majeure.</strong> Neither party shall be liable for
              any delay or failure to perform its obligations under these Terms
              (other than payment obligations) where such delay or failure
              results from causes beyond the affected party&apos;s reasonable
              control, including but not limited to acts of God, natural
              disasters, pandemics, epidemics, war, terrorism, riots, labor
              disputes, government actions, power failures, internet or
              telecommunications failures, or cyberattacks.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Electronic Communications Consent.</strong> By using the
              Service, you consent to receiving electronic communications from
              us, including service announcements, administrative messages,
              billing notifications, and updates to these Terms. These
              electronic communications constitute &quot;written&quot;
              communication for all legal purposes.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Headings.</strong> The section headings in these Terms
              are for convenience only and have no legal or contractual effect.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>No Third-Party Beneficiaries.</strong> These Terms do
              not create any third-party beneficiary rights in any individual
              or entity that is not a party to these Terms.
            </p>
          </section>

          {/* 20. Contact */}
          <section className="space-y-4">
            <h2 id="contact" className="text-xl font-bold text-primary">
              20. Contact
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about these Terms of Service, please
              contact us at{" "}
              <a
                href="mailto:support@hypetest.ai"
                className="text-primary underline"
              >
                support@hypetest.ai
              </a>
              .
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Rekt Brands Inc.
              <br />
              1207 Delaware Ave, #4069
              <br />
              Wilmington, DE 19806
              <br />
              United States
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
