"use client";


interface QuestionCardProps {

  title: string;

  placeholder: string;

  value: string;

  options?: {
    label: string;
    value: string;
  }[];

  onChange:
    (value: string) => void;
}



export default function QuestionCard({
  title,
  placeholder,
  value,
  options,
  onChange,
}: QuestionCardProps) {


return (

<div>

<h2 className="mb-4 text-2xl font-bold">
{title}
</h2>


{
options ? (

<select

value={value}

onChange={(e) =>
  onChange(e.target.value)
}

className="
w-full
rounded-lg
border
p-3
"

>

<option value="">
{placeholder}
</option>


{
options.map((option) => (

<option
key={option.value}
value={option.value}
>

{option.label}

</option>

))
}


</select>


) : (


<input

value={value}

placeholder={placeholder}

onChange={(e) =>
  onChange(e.target.value)
}

className="
w-full
rounded-lg
border
p-3
"

/>

)

}


</div>

);

}