import { TypeListing, typeMetadata } from '@/components/listing/TypeListing';

export const metadata = typeMetadata('REFLECTION');

export default function Page({ searchParams }: PageProps<'/reflections'>) {
  return <TypeListing type="REFLECTION" searchParams={searchParams} />;
}
