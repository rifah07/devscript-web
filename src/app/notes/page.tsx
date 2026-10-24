import { TypeListing, typeMetadata } from '@/components/listing/TypeListing';

export const metadata = typeMetadata('NOTE');

export default function Page({ searchParams }: PageProps<'/notes'>) {
  return <TypeListing type="NOTE" searchParams={searchParams} />;
}
