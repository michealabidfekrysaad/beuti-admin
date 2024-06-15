/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react';
import { GridContextProvider, GridDropZone, GridItem, swap } from 'react-grid-dnd';
import { rePositionOfElement } from '../Helper/QuickSale.Helper';
import QuickSaleItem from './QuickSaleItems/QuickSaleItem';
const QuickSaleItems = ({ quickSaleItems, setQuickSaleItems, handleDelete, isPOS }) => {
  const refElement = useRef();
  const [styleDefault, setStyleDefault] = useState({});
  // const [dimensions, setDimensions] = useState({
  //   height: typeof window !== 'undefined' && window.innerHeight,
  //   width: typeof window !== 'undefined' && window.innerWidth,
  // });
  const [restitems, setItRestems] = React.useState();
  function onChange(sourceId, sourceIndex, targetIndex) {
    const nextState = swap(quickSaleItems, sourceIndex, targetIndex);
    setQuickSaleItems(nextState);
  }

  useEffect(() => {
    if (refElement.current) {
      setStyleDefault({
        ...styleDefault,
        height: refElement.current.parentElement.clientHeight,
        width: refElement.current.parentElement.clientWidth,
      });
    }
  }, [quickSaleItems]);
  // useEffect(() => {
  //   if (refElement.current) {
  //     console.log(refElement.current.parentElement.clientWidth);
  //   }
  // }, [refElement?.current?.parentElement?.clientWidth, quickSaleItems]);
  useEffect(() => {
    setItRestems(Array.from(' '.repeat(16 - quickSaleItems.length)));
    setQuickSaleItems(quickSaleItems);
  }, [quickSaleItems]);
  // useEffect(() => {
  //   const handleResize = () => {
  //     setDimensions({
  //       height: window.innerHeight,
  //       width: window.innerWidth,
  //     });
  //   };
  //   window.addEventListener('resize', handleResize);
  // }, []);
  return (
    <>
      <section className="addquicksale_list">
        <GridContextProvider onChange={onChange}>
          <GridDropZone id="items" boxesPerRow={isPOS ? 3 : 4} rowHeight={184}>
            {quickSaleItems?.map((item) => (
              <GridItem key={item?.id}>
                <div ref={refElement}>
                  <QuickSaleItem item={item} handleDelete={handleDelete} />
                </div>
              </GridItem>
            ))}
          </GridDropZone>
        </GridContextProvider>
        <>
          {restitems?.map((ele, index) => (
            <div
              style={{
                pointerEvents: 'none',
                ...rePositionOfElement({
                  currentIndex: index + quickSaleItems.length,
                  displayNumbers: isPOS ? 3 : 4,
                  height: styleDefault.height || 184,
                  width: styleDefault.width || 379,
                }),
              }}
            >
              <QuickSaleItem undraggable />
            </div>
          ))}
        </>
      </section>
    </>
  );
};

export default QuickSaleItems;
