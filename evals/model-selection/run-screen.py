import subprocess,pathlib,json,time,concurrent.futures,hashlib,random,os
base=pathlib.Path(__file__).resolve().parent
profiles=[("astra-medium","gpt-6-astra","medium"),("terra-medium","gpt-5.6-terra","medium"),("luna-medium","gpt-5.6-luna","medium")]
prompts=sorted((base/"prompts").glob("*.txt"))
jobs=[]
random.seed(314159)
for prompt in prompts:
 order=profiles.copy();random.shuffle(order)
 jobs.extend((profile,prompt) for profile in order)
def run(job):
 (label,model,effort),prompt=job
 stem=label+"--"+prompt.stem;destination=base/"results";statuspath=destination/(stem+".json")
 if statuspath.exists():return json.loads(statuspath.read_text())
 command=["codex","exec","--ignore-user-config","--ignore-rules","--ephemeral","--sandbox","read-only","--skip-git-repo-check","--disable","multi_agent","--disable","shell_tool","-c",'cli_auth_credentials_store="auto"',"-c",'approval_policy="never"',"-c",'features.skip_host_skill_discovery=true',"-c",'model_reasoning_effort="'+effort+'"',"--model",model,"--json","-"]
 start=time.monotonic()
 with (destination/(stem+".jsonl")).open("w") as out,(destination/(stem+".stderr")).open("w") as err:
  try:
   proc=subprocess.run(command,input=prompt.read_text(),text=True,stdout=out,stderr=err,cwd=base/"isolated",timeout=180)
   status={"exit_code":proc.returncode}
  except subprocess.TimeoutExpired:status={"timeout":True}
 rows=[]
 for line in (destination/(stem+".jsonl")).read_text().splitlines():
  try:rows.append(json.loads(line))
  except json.JSONDecodeError:pass
 messages=[x["item"]["text"] for x in rows if x.get("type")=="item.completed" and x.get("item",{}).get("type")=="agent_message"]
 answer=messages[-1] if messages else ""
 (destination/(stem+".md")).write_text(answer+"\n")
 status.update({"profile":label,"model":model,"effort":effort,"case":prompt.stem,"elapsed_seconds":round(time.monotonic()-start,2),"prompt_sha256":hashlib.sha256(prompt.read_bytes()).hexdigest(),"usage":next((x.get("usage") for x in reversed(rows) if x.get("type")=="turn.completed"),None),"answer_sha256":hashlib.sha256(answer.encode()).hexdigest(),"tool_events":[x.get("item",{}).get("type") for x in rows if x.get("type")=="item.started" and x.get("item",{}).get("type") not in ["reasoning","agent_message"]]})
 statuspath.write_text(json.dumps(status,indent=2)+"\n")
 print(json.dumps({k:status[k] for k in ["profile","case","elapsed_seconds","usage"]}),flush=True)
 return status
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 results=list(pool.map(run,jobs))
(base/"results/summary.json").write_text(json.dumps(results,indent=2)+"\n")
print("COMPLETE",len(results),flush=True)
