import { ChangeEvent, FormEvent, useState } from 'react';
import { useUserContext } from '../context/userContext';
import { Filter } from '../lib/types';

type FilterMenuProps = {
  show: boolean;
};

const FilterMenu = ({ show }: FilterMenuProps) => {
  const { filters, setFilters } = useUserContext();
  const [formValues, setFormValues] = useState<Filter>(filters);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFilters(formValues);
    console.log(formValues);
  };

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.id;
    const value = e.target.value;
    setFormValues({ ...formValues, [id]: value });
  };

  return (
    <>
      {show && (
        <form
          className=" fixed left-0 top-[12vh] bg-gray-900 text-gray-200 h-full w-1/4 z-10 flex flex-col px-6"
          onSubmit={onSubmit}
        >
          <h2 className="text-center text-xl font-medium my-6">Filtros</h2>
          <div className="mb-6">
            <label htmlFor="category">Categoria</label>
            <select
              id="category"
              className="input text-gray-900"
              onChange={onChange}
            >
              <option value="todas">Todas</option>
              <option value="papeleria">Papeleria</option>
              <option value="comida">Comida</option>
              <option value="material">Material</option>
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="orderBy">Ordenar por:</label>
            <select
              id="orderBy"
              className="input text-gray-900"
              onChange={onChange}
            >
              <option value="totalScore">Por defecto</option>
              <option value="sold">Mas vendido</option>
              <option value="price">Precio</option>
              <option value="totalScore">Mejor calificado</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn primary-btn mt-6 w-3/4 self-center"
          >
            Aplicar
          </button>
        </form>
      )}
    </>
  );
};

export default FilterMenu;
