import { useRouter } from "next/router";
import CharacterDetail from "../../components/CharacterDetail";

export default function CharacterDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      {id && <CharacterDetail id={id} />}
    </div>
  );
}
