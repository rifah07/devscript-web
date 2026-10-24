import { TypeListing, typeMetadata } from '@/components/listing/TypeListing';

export const metadata = typeMetadata('POEM');

export default function Page({ searchParams }: PageProps<'/poems'>) {
  return <TypeListing type="POEM" searchParams={searchParams} />;
}
