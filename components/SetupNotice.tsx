export default function SetupNotice() {
  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold">아직 데이터베이스가 연결되지 않았어요</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        사이트를 쓰려면 Supabase 프로젝트를 만들고 환경변수 3개를 넣어주면 됩니다. 자세한 순서는
        저장소의 <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800">README.md</code>{" "}
        에 적어두었어요.
      </p>

      <ol className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <li>
          <span className="font-medium">1.</span> supabase.com 에서 무료 프로젝트를 만듭니다.
        </li>
        <li>
          <span className="font-medium">2.</span> SQL Editor 에{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800">
            supabase/schema.sql
          </code>{" "}
          내용을 붙여넣고 실행합니다.
        </li>
        <li>
          <span className="font-medium">3.</span>{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800">.env.local</code> 에
          아래 값을 채웁니다.
        </li>
      </ol>

      <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
        {`SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
CLASS_EDIT_PASSWORD=우리반비밀번호
AUTH_SECRET=아무_긴_문자열`}
      </pre>
    </div>
  );
}
