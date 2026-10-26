import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { Button } from '@/components/ui'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="This page doesn't exist." />
      <PageHero
        title="Nothing at this address."
        sub="The link may be from the old version of this site, or mistyped. Everything that was here now lives under Work, Experience, Leadership and About."
      >
        <div className="flex flex-wrap gap-3">
          <Button to="/" variant="solid">
            Go to the home page
          </Button>
          <Button to="/work">See the work</Button>
        </div>
      </PageHero>
    </>
  )
}
