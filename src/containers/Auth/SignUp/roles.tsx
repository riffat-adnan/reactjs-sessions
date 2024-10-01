import { useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { FiChevronDown, FiCheck } from "react-icons/fi";
const people = [
  { name: "Choose Role", id: 0 },
  { name: "Teacher", id: 1 },
  { name: "Student", id: 2 },
  { name: "Parent", id: 3 },
];

function Roles({ selectUserRole }) {
  const [selected, setSelected] = useState(people[0]);

  return (
    <>
      <Listbox
        value={selected}
        onChange={(role) => {
          setSelected(role);
          selectUserRole(role);
        }}>
        <div className="relative mt-1">
          <Listbox.Button className="relative  text-left cursor-pointer shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] border-[#D0D5DD] bg-white rounded-[8px] min-h-[44px] block w-full px-[14px] outline-primary placeholder:font-normal font-medium text-base placeholder:text-[#667085] text-[#101828]">
            <span className="block truncate">{selected.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <FiChevronDown />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] border-[#D0D5DD] bg-white rounded-[8px] py-1">
              {people.map((person, personIdx) => (
                <Listbox.Option
                  key={personIdx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 font-medium text-base ${
                      active ? "bg-primary text-[#fff]" : " text-[#101828]"
                    }`
                  }
                  value={person}>
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-semibold" : "font-medium"
                        }`}>
                        {person.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <FiCheck />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </>
  );
}

export default Roles;
